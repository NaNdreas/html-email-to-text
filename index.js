const htmlparser = require('htmlparser2');

var textString = '';

const htmlToText = html => {
  if (typeof(html) !== 'string') {
    return new Error(`Expected a string but got ${typeof(html)}`);
  }

  parser.write(html);
  parser.end();

  return textString;
};

const parser = new htmlparser.Parser({
  onopentag: (name, attribs) => {
    formatElement(name, attribs, false);
  },

  ontext: text => {
    formatText(text);
  },

  onclosetag: tagname => {
    formatElement(tagname, {}, true);
  }
}, {decodeEntities: true});

const elements = {
  a: {
    current: false,
    href: '',
    text: ''
  },
  img: {
    current: false,
    alt: ''
  },
  style: {
    current: false
  },
  script: {
    current: false
  },
  title: {
    current: false
  }
};

const formatText = text => {
  if (/^\s*$/.test(text)) {
    return;
  }

  // Format start of string
  if (/^\s{2,}/.test(text) || /\s{2,}$/.test(textString)) {
    // If text starts with multiple whitespace chars,
    // or previous string ends with multiple whitespace chars
    // replace with two line breaks only
    text = text.replace(/^\s+/g, '\n\n');

    // Max 2 line breaks in a row
    textString = textString.replace(/\s+$/g, '');
  } else {
    // Otherwise no space
    text = text.replace(/^\s+/g, '');
  }

  // Format end of string
  if (/\s{2,}$/.test(text)) {
    // if text ends with multiple whitespace chars
    // replace with two line breaks only
    text = text.replace(/\s+$/, '\n\n');
  } else if (!/\s+$/.test(text)) {
    // If no whitespace after string, add one space
    text += ' ';
  }

  if (elements.a.current) {
    elements.a.text += text;
  } else if (elements.title.current) {
    textString += `${text.toUpperCase()}\n\n--------------------\n\n\n`;
  } else if (!elements.style.current && !elements.style.script) {
    if (text.startsWith('.') || text.startsWith(',') || text.startsWith('!') || text.startsWith('?')) {
      // Prevent space if matching any of . , ! ?
      textString = textString.replace(/ $/, '');
    }

    textString += text;
  }
};

const formatElement = (name, attribs, isClosingTag) => {
  switch (name) {
    case 'a':
      if (isClosingTag) {
        if (elements.a.text) {
          textString += elements.a.text;
          elements.a.text = '';
        }

        if (elements.a.href) {
          textString += elements.a.href;
          elements.a.href = '';
        }

        elements.a.current = false;
        return;
      }

      if (attribs.href) {
        elements.a.href = `[${attribs.href}] `;
      }

      elements.a.current = true;
      break;

    case 'img':
      if (isClosingTag) {

        if (elements.img.alt) {
          // Max two line breaks as whitespace.
          textString.replace(/\s+$/, '');
          textString += `\n\n${elements.img.alt}`;
          elements.img.alt = '';

          if (elements.a.href) {
            textString += `\n${elements.a.href}`;
            elements.a.href = '';
            elements.a.text = '';
          }
        }

        elements.img.current = false;
        return;
      }

      if (!attribs) {
        return;
      }

      if (attribs.alt) {
        elements.img.alt = attribs.alt;
      }

      elements.img.current = true;
      break;

    case 'style':
      elements.style.current = !isClosingTag;
      break;

    case 'script':
      elements.script.current = !isClosingTag;
      break;

    case 'title':
      elements.title.current = !isClosingTag;
      break;
  }
}

module.exports = htmlToText;
