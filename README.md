# html-email-to-text
Convert html emails to (formatted) plain text

## Install
```
$ npm install --save html-email-to-text
```

## Usage
```
const htmlToText = require('html-email-to-text');

htmlToText('Html as a string');
//=> Formatted plain text as a string
```
## Examples

### HTML input
```
<!DOCTYPE html>
<head>
  <title>Subject line: Title will be uppercase</title>
</head>
<body>
	<table>
	  <tr>
	    <td>
	      <table>
	        <tr>
	          <td>
	            <table>
	              <tr>
	                <td>&nbsp;</td> <!-- whitespace and comments will be ignored -->
	              </tr>
	              <tr>
	                <td>Hello there</td>
	              </tr>
	            </table>
	          </td>
	        </tr>
	        <tr>
	        	<td>
	        		This email can be formatted in plain text too. It works with a <a href="/links">link</a> or <a href="/another-link">two</a>.
	        	</td>
	        </tr>
	        <tr>
	        	<td>
	        		If you wrap links around images it will use the alt text together with the link.
	        		<a href="/link-to-somewhere"><img src="image.jpg" alt="alt text"></a>
	        	</td>
	        </tr>
	      </table>
	    </td>
	  </tr>
	</table>
</body>
</html>
```

### Text output
```
SUBJECT LINE: TITLE WILL BE UPPERCASE

--------------------

Hello there

This email can be formatted in plain text too. It works with a link [/links] or two [/another-link].

If you wrap links around images it will use the alt text together with the link.

alt text
[/link-to-somewhere]
```
