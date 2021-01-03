var http = require('http'), //This module provides the HTTP server functionalities
  path = require('path'), //The path module provides utilities for working with file and directory paths
  express = require('express'), //This module allows this app to respond to HTTP Requests, defines the routing and renders back the required content
  fs = require('fs'), //This module allows to work witht the file system: read and write files back
  xmlParse = require('xslt-processor').xmlParse, //This module allows us to work with XML files
  xsltProcess = require('xslt-processor').xsltProcess, //The same module allows us to utilise XSL Transformations
  xml2js = require('xml2js'); //This module does XML to JSON conversion and also allows us to get from JSON back to XML

var router = express(); //We set our routing to be handled by Express
var server = http.createServer(router); //This is where our server gets created

router.use(express.static(path.resolve(__dirname, 'views'))); //We serve static content from "views" folder
router.use(express.urlencoded({ extended: true })); //We allow the data sent from the client to be coming in as part of the URL in GET and POST requests
router.use(express.json()); //We include support for JSON that is coming from the client

// Function to read in XML file and convert it to JSON
function xmlFileToJs(filename, cb) {
  var filepath = path.normalize(path.join(__dirname, filename));
  fs.readFile(filepath, 'utf8', function (err, xmlStr) {
    if (err) throw (err);
    xml2js.parseString(xmlStr, {}, cb);
  });
}

//Function to convert JSON to XML and save it
function jsToXmlFile(filename, obj, cb) {
  var filepath = path.normalize(path.join(__dirname, filename));
  var builder = new xml2js.Builder();
  var xml = builder.buildObject(obj);
  fs.unlinkSync(filepath);
  fs.writeFile(filepath, xml, cb);
}

router.get('/get/main', function (req, res) {

  res.writeHead(200, { 'Content-Type': 'text/html' }); //We are responding to the client that the content served back is HTML and the it exists (code 200)

  var xml = fs.readFileSync('Books.xml', 'utf8'); //We are reading in the XML file
  var xsl = fs.readFileSync('Books.xsl', 'utf8'); //We are reading in the XSL file
  var doc = xmlParse(xml); //Parsing our XML file
  var stylesheet = xmlParse(xsl); //Parsing our XSL file
  var result = xsltProcess(doc, stylesheet); //This does our XSL Transformation
  res.end(result.toString()); //Send the result back to the user, but convert to type string first

});

router.get('/get/updates', function (req, res) {

  res.writeHead(200, { 'Content-Type': 'text/html' }); //We are responding to the client that the content served back is HTML and the it exists (code 200)

  var xml = fs.readFileSync('Updates.xml', 'utf8'); //We are reading in the XML file
  var xsl = fs.readFileSync('Updates.xsl', 'utf8'); //We are reading in the XSL file
  var doc = xmlParse(xml); //Parsing our XML file
  var stylesheet = xmlParse(xsl); //Parsing our XSL file
  var result = xsltProcess(doc, stylesheet); //This does our XSL Transformation
  res.end(result.toString()); //Send the result back to the user, but convert to type string first

});

router.post('/post/json', function (req, res) {

  let id = '';
  let idCopied = '';

  function appendJSON(obj) {

    console.log(obj)

    xmlFileToJs('Books.xml', function (err, result) {
      if (err) throw (err);

      /**
       * function to generate a random 8-digit hex string 
       * https://codepen.io/code_monk/pen/FvpfI */
      const generateObjId = function (len) {
        var maxlen = 8,
          min = Math.pow(16, Math.min(len, maxlen) - 1)
        max = Math.pow(16, Math.min(len, maxlen)) - 1,
          n = Math.floor(Math.random() * (max - min + 1)) + min,
          r = n.toString(16);
        while (r.length < len) {
          r = r + randHex(len - maxlen);
        }
        return r;
      };
      id = generateObjId(8);
      idCopied = id;
      result.books.section[obj.sec_n].entree.push(
        {
          // 'id': obj.id,
          'id': id,
          'title': obj.title,
          'author': obj.author,
          'price': obj.price
        }
      );
      console.log(JSON.stringify(result, null, "  "));

      jsToXmlFile('Books.xml', result, function (err) {
        if (err) console.log(err);
      });
    });
  };
  appendJSON(req.body);
  res.redirect('back');

  function appendJSONToCurrUpdate(obj) {

    console.log(obj)

    xmlFileToJs('Updates.xml', function (err, result) {
      if (err) throw (err);

      result.updates.section[obj.sec_n].entree.push(
        {
          'type': "CREATED",
          'id': idCopied,
          'title': obj.title,
          'author': obj.author,
          'price': obj.price
        }
      );
      console.log(JSON.stringify(result, null, "  "));

      jsToXmlFile('Updates.xml', result, function (err) {
        if (err) console.log(err);
      });
    });
  };
  appendJSONToCurrUpdate(req.body);
  idCopied = '';

});

router.post('/post/update', function (req, res) {

  let idCopied = '';

  function updateJSON(obj) {

    console.log(obj)
    //console.log(obj.entree);

    xmlFileToJs('Books.xml', function (err, result) {
      if (err) throw (err);

      idCopied = obj.id;
      //result.books.section[obj.sec_n].entree[obj.entree]['id'] = obj.id;
      result.books.section[obj.sec_n].entree[obj.entree]['title'] = obj.title;
      result.books.section[obj.sec_n].entree[obj.entree]['author'] = obj.author;
      result.books.section[obj.sec_n].entree[obj.entree]['price'] = obj.price;

      console.log(JSON.stringify(result, null, "  "));

      jsToXmlFile('Books.xml', result, function (err) {
        if (err) console.log(err);
      });
    });
  };

  updateJSON(req.body);

  res.redirect('back');

  function appendJSONToCurrUpdate(obj) {

    console.log(obj)

    xmlFileToJs('Updates.xml', function (err, result) {
      if (err) throw (err);

      result.updates.section[obj.sec_n].entree.push(
        {
          'type': "UPDATED",
          'id': idCopied,
          'title': obj.title,
          'author': obj.author,
          'price': obj.price
        }
      );
      console.log(JSON.stringify(result, null, "  "));

      jsToXmlFile('Updates.xml', result, function (err) {
        if (err) console.log(err);
      });
    });
  };
  appendJSONToCurrUpdate(req.body);
  idCopied = '';

});

router.post('/post/delete', function (req, res) {

  let id = '', title = '', author = '', price = '';

  function deleteJSON(obj) {

    console.log("deleteJSON" + obj);

    xmlFileToJs('Books.xml', function (err, result) {

      if (err) throw (err);

      id = result.books.section[obj.section].entree[obj.entree]['id'];
      title = result.books.section[obj.section].entree[obj.entree]['title'];
      author = result.books.section[obj.section].entree[obj.entree]['author'];
      price = result.books.section[obj.section].entree[obj.entree]['price'];
      
      delete result.books.section[obj.section].entree[obj.entree];
      console.log(JSON.stringify(result, null, "  "));

      jsToXmlFile('Books.xml', result, function (err) {
        if (err) console.log(err);
      });
    });
  };

  deleteJSON(req.body);

  res.redirect('back');

  function appendJSONToCurrUpdate(obj) {

    console.log(obj)

    xmlFileToJs('Updates.xml', function (err, result) {
      if (err) throw (err);

      result.updates.section[obj.section].entree.push(
        {
          'type': "DELETED",
          'id': id,
          'title': title,
          'author': author,
          'price': price
        }
      );
      console.log(JSON.stringify(result, null, "  "));

      jsToXmlFile('Updates.xml', result, function (err) {
        if (err) console.log(err);
      });
    });
  };

  appendJSONToCurrUpdate(req.body);
  id = '', title = '', author = '', price = '';

});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function () {
  var addr = server.address();
  console.log("Server listnening at", addr.address + ":" + addr.port);
});