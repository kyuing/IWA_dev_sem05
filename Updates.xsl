<?xml version="1.0" encoding="US-ASCII" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
  <xsl:output method="html" omit-xml-declaration="yes" indent="yes" />

  <!-- references -->
  <!-- https://support.claris.com/s/article/Looping-in-XSLT-1503692927412?language=en_US -->
  <!-- http://www.humbug.in/2010/a-sample-loop-in-xsl-alternative-for-while-for-loops-2/ -->
  <xsl:template match="/">
    <table id="menuTable" border="1" class="indent">
      <thead>
        <tr>
          <th colspan="5">
            <section class="container d-flex flex-column justify-content-center align-items-center">
              <span class="mb-2">Select a book section</span>
              <select onchange="changeSection(value)" class="custom-select col-8">
                <option value="Fiction" select="selected">Fiction</option>
                <option value="SF">SF</option>
                <option value="IT">IT</option>
              </select>
            </section>
          </th>
        </tr>
        <tr id="field">
          <th>Update Type</th>
          <th>ID</th>
          <th>Title</th>
          <th>Author</th>
          <th>Price</th>
        </tr>
      </thead>

      <tbody id="sectionFiction">
        <xsl:call-template name="loopFiction">
          <xsl:with-param name="size" select="number(10)" />
          <xsl:with-param name="loadSet" select="number(1)" />
        </xsl:call-template>
      </tbody>

      <tbody id="sectionSF">
        <xsl:call-template name="loopSF">
          <xsl:with-param name="size" select="number(10)" />
          <xsl:with-param name="loadSet" select="number(1)" />
        </xsl:call-template>
      </tbody>

      <tbody id="sectionIT">
        <xsl:call-template name="loopIT">
          <xsl:with-param name="size" select="number(10)" />
          <xsl:with-param name="loadSet" select="number(1)" />
        </xsl:call-template>
      </tbody>
    </table>
  </xsl:template>

  <xsl:template name="loopFiction">
    <xsl:variable name="totalNumOfEntreeSize" select="count(/updates/section[@name='Fiction']/entree)" />
    <!-- 
      a quotient can be a decimal. 
      prevent it by returning the smallest integer that is greater than the number argument 
      so that nothing can technically be left, not being assigned into a loadSet  
    -->
    <xsl:variable name="loadSetSize" select="ceiling((number($totalNumOfEntreeSize)) div $size)" />
    <xsl:choose>
      <xsl:when test="$loadSet &lt;= $loadSetSize">
        <xsl:for-each select="/updates/section[@name='Fiction']/entree">
          <xsl:variable name="secIndexNum" select="count(../preceding-sibling::section)" />
          <xsl:variable name="entreeNum" select="position()" />
          <xsl:variable name="start" select="$size * ($loadSet - 1) + 1" />

          <xsl:if test="position() &gt;= $start and position() &lt; $start + $size">
            <xsl:if test="$loadSet = 1">
              <tr style="display: table-row;">
                <xsl:attribute name="fictionSet">
                  <xsl:value-of select="$loadSet" />
                </xsl:attribute>
                <xsl:attribute name="secName">
                  <xsl:value-of select="../@name" />
                </xsl:attribute>
                <xsl:attribute name="secIndexNum">
                  <xsl:value-of select="$secIndexNum" />
                </xsl:attribute>
                <xsl:attribute name="entree">
                  <xsl:value-of select="$entreeNum" />
                </xsl:attribute>
                <td>
                  <b>
                    <xsl:value-of select="type" />
                  </b>
                </td>
                <td>
                  <xsl:value-of select="id" />
                </td>
                <td>
                  <xsl:value-of select="title" />
                </td>
                <td>
                  <xsl:value-of select="author" />
                </td>
                <td>
                  <xsl:value-of select="price" />
                </td>
              </tr>
            </xsl:if>

            <xsl:if test="$loadSet > 1">
              <tr style="display:none">
                <xsl:attribute name="fictionSet">
                  <xsl:value-of select="$loadSet" />
                </xsl:attribute>
                <xsl:attribute name="prevLoadSet">
                  <xsl:value-of select="number($loadSet)-1" />
                </xsl:attribute>
                <xsl:attribute name="secName">
                  <xsl:value-of select="../@name" />
                </xsl:attribute>
                <xsl:attribute name="secIndexNum">
                  <xsl:value-of select="$secIndexNum" />
                </xsl:attribute>
                <xsl:attribute name="entree">
                  <xsl:value-of select="$entreeNum" />
                </xsl:attribute>
                <td>
                  <b>
                    <xsl:value-of select="type" />
                  </b>
                </td>
                <td>
                  <xsl:value-of select="id" />
                </td>
                <td>
                  <xsl:value-of select="title" />
                </td>
                <td>
                  <xsl:value-of select="author" />
                </td>
                <td>
                  <xsl:value-of select="price" />
                </td>
              </tr>
            </xsl:if>
          </xsl:if>
        </xsl:for-each>

        <xsl:call-template name="loopFiction">
          <xsl:with-param name="loadSet" select="$loadSet + 1" />
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <tr>
          <td colspan="5">
            <button id="loadMore" onclick="loadMore(sectionFiction)" class="btn btn-info btn-block mt-3" >Load More</button>
          </td>
        </tr>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="loopSF">
    <xsl:variable name="totalNumOfEntreeSize" select="count(/updates/section[@name='SF']/entree)" />
    <!-- 
      a quotient can be a decimal. 
      prevent it by returning the smallest integer that is greater than the number argument 
      so that nothing can technically be left, not being assigned into a loadSet  
    -->
    <xsl:variable name="loadSetSize" select="ceiling((number($totalNumOfEntreeSize)) div $size)" />
    <!-- <p><xsl:value-of select="$loadSetSize" /></p> -->

    <xsl:choose>
      <xsl:when test="$loadSet &lt;= $loadSetSize">

        <xsl:for-each select="/updates/section[@name='SF']/entree">
          <xsl:variable name="secIndexNum" select="count(../preceding-sibling::section)" />
          <xsl:variable name="entreeNum" select="position()" />
          <xsl:variable name="start" select="$size * ($loadSet - 1) + 1" />

          <xsl:if test="position() &gt;= $start and position() &lt; $start + $size">

            <xsl:if test="$loadSet = 1">
              <tr style="display: table-row;">
                <xsl:attribute name="SFSet">
                  <xsl:value-of select="$loadSet" />
                </xsl:attribute>
                <xsl:attribute name="secName">
                  <xsl:value-of select="../@name" />
                </xsl:attribute>
                <xsl:attribute name="secIndexNum">
                  <xsl:value-of select="$secIndexNum" />
                </xsl:attribute>
                <xsl:attribute name="entree">
                  <xsl:value-of select="$entreeNum" />
                </xsl:attribute>
                <td>
                  <b>
                    <xsl:value-of select="type" />
                  </b>
                </td>
                <td>
                  <xsl:value-of select="id" />
                </td>
                <td>
                  <xsl:value-of select="title" />
                </td>
                <td>
                  <xsl:value-of select="author" />
                </td>
                <td>
                  <xsl:value-of select="price" />
                </td>
              </tr>
            </xsl:if>

            <xsl:if test="$loadSet > 1">
              <tr style="display:none">
                <xsl:attribute name="SFSet">
                  <xsl:value-of select="$loadSet" />
                </xsl:attribute>
                <xsl:attribute name="prevLoadSet">
                  <xsl:value-of select="number($loadSet)-1" />
                </xsl:attribute>
                <xsl:attribute name="secName">
                  <xsl:value-of select="../@name" />
                </xsl:attribute>
                <xsl:attribute name="secIndexNum">
                  <xsl:value-of select="$secIndexNum" />
                </xsl:attribute>
                <xsl:attribute name="entree">
                  <xsl:value-of select="$entreeNum" />
                </xsl:attribute>
                <td>
                  <b>
                    <xsl:value-of select="type" />
                  </b>
                </td>
                <td>
                  <xsl:value-of select="id" />
                </td>
                <td>
                  <xsl:value-of select="title" />
                </td>
                <td>
                  <xsl:value-of select="author" />
                </td>
                <td>
                  <xsl:value-of select="price" />
                </td>
              </tr>
            </xsl:if>

          </xsl:if>
        </xsl:for-each>
        <xsl:call-template name="loopSF">
          <xsl:with-param name="loadSet" select="$loadSet + 1" />
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <tr>
          <td colspan="5">
            <button id="loadMore" onclick="loadMore(sectionSF)" class="btn btn-info btn-block mt-3">Load More</button>
          </td>
        </tr>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="loopIT">
    <xsl:variable name="totalNumOfEntreeSize" select="count(/updates/section[@name='IT']/entree)" />
    <!-- 
      a quotient can be a decimal. 
      prevent it by returning the smallest integer that is greater than the number argument 
      so that nothing can technically/hopefully be left, not being assigned into a loadSet  
    -->
    <xsl:variable name="loadSetSize" select="ceiling((number($totalNumOfEntreeSize)) div $size)" />

    <xsl:choose>
      <xsl:when test="$loadSet &lt;= $loadSetSize">

        <xsl:for-each select="/updates/section[@name='IT']/entree">
          <xsl:variable name="secIndexNum" select="count(../preceding-sibling::section)" />
          <xsl:variable name="entreeNum" select="position()" />
          <xsl:variable name="start" select="$size * ($loadSet - 1) + 1" />

          <xsl:if test="position() &gt;= $start and position() &lt; $start + $size">

            <xsl:if test="$loadSet = 1">
              <tr style="display: table-row;">
                <xsl:attribute name="ITSet">
                  <xsl:value-of select="$loadSet" />
                </xsl:attribute>
                <xsl:attribute name="secName">
                  <xsl:value-of select="../@name" />
                </xsl:attribute>
                <xsl:attribute name="secIndexNum">
                  <xsl:value-of select="$secIndexNum" />
                </xsl:attribute>
                <xsl:attribute name="entree">
                  <xsl:value-of select="$entreeNum" />
                </xsl:attribute>
                <td>
                  <b>
                    <xsl:value-of select="type" />
                  </b>
                </td>
                <td>
                  <xsl:value-of select="id" />
                </td>
                <td>
                  <xsl:value-of select="title" />
                </td>
                <td>
                  <xsl:value-of select="author" />
                </td>
                <td>
                  <xsl:value-of select="price" />
                </td>
              </tr>
            </xsl:if>

            <xsl:if test="$loadSet > 1">
              <tr style="display:none">
                <xsl:attribute name="ITSet">
                  <xsl:value-of select="$loadSet" />
                </xsl:attribute>
                <xsl:attribute name="prevLoadSet">
                  <xsl:value-of select="number($loadSet)-1" />
                </xsl:attribute>
                <xsl:attribute name="secName">
                  <xsl:value-of select="../@name" />
                </xsl:attribute>
                <xsl:attribute name="secIndexNum">
                  <xsl:value-of select="$secIndexNum" />
                </xsl:attribute>
                <xsl:attribute name="entree">
                  <xsl:value-of select="$entreeNum" />
                </xsl:attribute>
                <td>
                  <b>
                    <xsl:value-of select="type" />
                  </b>
                </td>
                <td>
                  <xsl:value-of select="id" />
                </td>
                <td>
                  <xsl:value-of select="title" />
                </td>
                <td>
                  <xsl:value-of select="author" />
                </td>
                <td>
                  <xsl:value-of select="price" />
                </td>
              </tr>
            </xsl:if>

          </xsl:if>
        </xsl:for-each>
        <xsl:call-template name="loopIT">
          <xsl:with-param name="loadSet" select="$loadSet + 1" />
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <tr>
          <td colspan="5">
            <button id="loadMore" onclick="loadMore(sectionIT)" class="btn btn-info btn-block mt-3">Load More</button>
          </td>
        </tr>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
</xsl:stylesheet>