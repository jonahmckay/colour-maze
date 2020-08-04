// A2Z F16
// Daniel Shiffman
// http://shiffman.net/a2z
// https://github.com/shiffman/A2Z-F16

// This is based on Allison Parrish's great RWET examples
// https://github.com/aparrish/rwet-examples

// Prototype is magic!  By accessing Array.prototype
// we can augment every single String Array object with an new function

// This object will do a Markov chain by character or by "word"

// A function to split a text up into tokens
// Just using spaces for now to preserve punctuation
String.prototype.tokenize = function() {
  return this.split(/\s+/);
}

// Like python's choice this will return a
// random element from an array
Array.prototype.choice = function() {
  var i = Math.floor(Math.random()*this.length);
  return this[i];
}

// A MarkovGenerate object
function MarkovGeneratorWord(n, max) {
  // Order (or length) of each ngram
  this.n = n;
  // What is the maximum amount we will generate?
  this.max = max;
  // An object as dictionary
  // each ngram is the key, a list of possible next elements are the values
  this.ngrams = {};
  // A separate array of possible beginnings to generated text
  this.beginnings = [];

  // A function to feed in text to the markov chain
  this.feed = function(text) {

    var tokens = text.tokenize();

    // Discard this line if it's too short
    if (tokens.length < this.n) {
      return false;
    }

    // Store the first ngram of this line
    var beginning = tokens.slice(0, this.n).join(' ');
    this.beginnings.push(beginning);

      // Now let's go through everything and create the dictionary
    for (var i = 0; i < tokens.length - this.n; i++) {
      // Usings slice to pull out N elements from the array
      gram = tokens.slice(i, i + this.n).join(' ');
      // What's the next element in the array?
      next = tokens[i + this.n];

      // Is this a new one?
      if (!this.ngrams[gram]) {
        this.ngrams[gram] = [];
      }
      // Add to the list
      this.ngrams[gram].push(next);
    }
  }

  // Generate a text from the information ngrams
  this.generate = function() {

    // Get a random beginning
    var current = this.beginnings.choice();

    // The output is now an array of tokens that we'll join later
    var output = current.tokenize();


    // Generate a new token max number of times
    for (var i = 0; i < this.max; i++) {
      // If this is a valid ngram
      if (this.ngrams[current]) {
        // What are all the possible next tokens
        var possible_next = this.ngrams[current];
        // Pick one randomly
        var next = possible_next.choice();
        // Add to the output
        output.push(next);
        // Get the last N entries of the output; we'll use this to look up
        // an ngram in the next iteration of the loop
        current = output.slice(output.length - this.n, output.length).join(' ');
      } else {
        break;
      }
    }
    // Here's what we got!
    return output.join(' ');
  }
}

let markovtext = `To find a piece of deep violet or grape-coloured material that has been pressed between the pages of a notebook.\n\nLong flowering branches of beautifully coloured wisteria entwined about a pine tree.\n\nespecially those that have glossy colours.\n\nfor the cattle had eaten all the straw that was placed at the head and the foot. And upon it was stretched an old russet- coloured rug, threadbare and ragged; and a coarse sheet, full of slits, was upon the rug, and an ill-stuffed pillow, and a worn-out cover upon the sheet.\n\nThe name of the carpet, and it was one of its properties that whoever was upon it no one could see him, and ey could see every one. And it would retain no colour but its own.\n\nsat within the carpet, and they stood before them. wilt thou play chess?\n\nwearing a coat and a surcoat of yellow satin, and hose of thin greenish-yellow cloth upon eir feet, and over eir hose shoes of parti-coloured leather, fastened at the insteps with golden clasps. And they bore a heavy three-edged sword with a golden hilt, in a scabbard of black leather tipped with fine gold.\n\nAnd upon eir feet were hose of fine Totness, and shoes of parti-coloured leather, clasped with gold, and the youth was of noble bearing, fair of face, with ruddy cheeks and large hawk's eyes\n\nupon a dun-coloured horse coming towards them.\n\nand tipped with Spanish laton. The belt of the sword was of dark green leather with golden slides and a clasp of ivory upon it, and a buckle of jet-black upon the clasp.\n\n\nA helmet of gold was on the head of the knight, set with precious stones of great virtue, and at the top of the helmet was the image of a flame- coloured leopard with two ruby-red stones in its head, so that it was astounding for a warrior, however stout eir heart, to look at the face of the leopard, much more at the face of the knight.\n\nHe had in eir hand a blue-shafted lance, but from the haft to the point it was stained crimson-red with the blood of the Ravens and their plumage.\n\nAnd at the top of the helmet was the figure of a flame-coloured lion, with a fiery-red tongue, issuing above a foot from eir mouth, and with venomous eyes, crimson-red, in eir head. \n\nSo they finished the game and began another; and as they were finishing that game, lo, they heard a great tumult and a clamour of armed men, and a croaking of Ravens.\n\nwith sparkling stones of crystal in it, and at the crest of the helmet was the figure of a griffin, with a stone of many virtues in its head. \n\nwater becomes crystalline stone\nunder the mountain wind where the great cold is,\nand the air always turns into the cold element there, so that water is queen\nthere, because of the cold.\n\nAnd it was as if gold covered their bodies / and melted the crystals\n\nI remember one occasion when I visited the Palace to see the procession of blue horses.\n\nred satin wrought with yellow silk, and yellow were the borders of their scarf. \n\ndost thou see the ring with a stone set in it, that is upon the Emperor's hand?" "I see it," ey answered. "It is one of the properties of that stone to enable thee to remember that thou seest here to-night, and hadst thou not seen the stone, thou wouldest never have been able to remember aught thereof.”\n\nAnd they were clad in a coat of yellow satin, falling as low as the small of their leg, and embroidered with threads of red silk.\n\nThose birds, ne’er a note fell wrong,\nFor they were skilful thus, and wise;\nHearing those creatures of the skies,\nSeeing the green leaves all around,\nI was right joyful at the sound,\nSuch that there was none who knew\n\nThen, behold, they brought bowls of silver wherein was water to wash, and towels of linen, some green and some white; and I washed.\n\nand traversed the valley till they reached the green tree, where they saw the fountain, and the bowl, and the slab.\n\nLast year's paper fan. A night with a clear moon.\n\nOpening the door, that I might be,\nOf that green branched garden free.\n\nand their eyebrows black as jet, and such part of their wrist as could be seen between a glove and a sleeve, was whiter than the lily, and thicker than an ankle.\n\n`;
