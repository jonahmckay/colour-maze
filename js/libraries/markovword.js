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

let markovtext = `To find a piece of deep violet or grape-coloured material that has been pressed between the pages of a notebook.\n\nLong flowering branches of beautifully coloured wisteria entwined about a pine tree.\nespecially those that have glossy colours.\nfor the cattle had eaten all the straw that was placed at the head and the foot. And upon it was stretched an old russet- coloured rug, threadbare and ragged; and a coarse sheet, full of slits, was upon the rug, and an ill-stuffed pillow, and a worn-out cover upon the sheet.\nThe name of the carpet, and it was one of its properties that whoever was upon it no one could see him, and ey could see every one. And it would retain no colour but its own.\nsat within the carpet, and they stood before them. wilt thou play chess?\nwearing a coat and a surcoat of yellow satin, and hose of thin greenish-yellow cloth upon eir feet, and over eir hose shoes of parti-coloured leather, fastened at the insteps with golden clasps. And they bore a heavy three-edged sword with a golden hilt, in a scabbard of black leather tipped with fine gold.\n\nAnd upon eir feet were hose of fine Totness, and shoes of parti-coloured leather, clasped with gold, and the youth was of noble bearing, fair of face, with ruddy cheeks and large hawk's eyes\nupon a dun-coloured horse coming towards them.\n\nand tipped with Spanish laton. The belt of the sword was of dark green leather with golden slides and a clasp of ivory upon it, and a buckle of jet-black upon the clasp.\nA helmet of gold was on the head of the knight, set with precious stones of great virtue, and at the top of the helmet was the image of a flame- coloured leopard with two ruby-red stones in its head, so that it was astounding for a warrior, however stout eir heart, to look at the face of the leopard, much more at the face of the knight.\n\nHe had in eir hand a blue-shafted lance, but from the haft to the point it was stained crimson-red with the blood of the Ravens and their plumage.\nAnd at the top of the helmet was the figure of a flame-coloured lion, with a fiery-red tongue, issuing above a foot from eir mouth, and with venomous eyes, crimson-red, in eir head. \nSo they finished the game and began another; and as they were finishing that game, lo, they heard a great tumult and a clamour of armed men, and a croaking of Ravens.\n\nwith sparkling stones of crystal in it, and at the crest of the helmet was the figure of a griffin, with a stone of many virtues in its head. \nwater becomes crystalline stone\nunder the mountain wind where the great cold is,\nand the air always turns into the cold element there, so that water is queen\nthere, because of the cold.\nAnd it was as if gold covered their bodies / and melted the crystals\nI remember one occasion when I visited the Palace to see the procession of blue horses.\n\nred satin wrought with yellow silk, and yellow were the borders of their scarf. \ndost thou see the ring with a stone set in it, that is upon the Emperor's hand?" "I see it," ey answered. "It is one of the properties of that stone to enable thee to remember that thou seest here to-night, and hadst thou not seen the stone, thou wouldest never have been able to remember aught thereof.”\nAnd they were clad in a coat of yellow satin, falling as low as the small of their leg, and embroidered with threads of red silk.\n\nThose birds, ne’er a note fell wrong,\nFor they were skilful thus, and wise;\nHearing those creatures of the skies,\nSeeing the green leaves all around,\nI was right joyful at the sound,\nSuch that there was none who knew\nThen, behold, they brought bowls of silver wherein was water to wash, and towels of linen, some green and some white; and I washed.\nand traversed the valley till they reached the green tree, where they saw the fountain, and the bowl, and the slab.\n\nLast year's paper fan. A night with a clear moon.\nOpening the door, that I might be,\nOf that green branched garden free.\nand their eyebrows black as jet, and such part of their wrist as could be seen between a glove and a sleeve, was whiter than the lily, and thicker than an ankle.\nTo find a piece of deep violet or grape-coloured material that has been pressed between the pages of a notebook.\nLong flowering branches of beautifully coloured wisteria entwined about a pine tree.\nespecially those that have glossy colours.\nfor the cattle had eaten all the straw that was placed at the head and the foot. And upon it was stretched an old russet- coloured rug, threadbare and ragged; and a coarse sheet, full of slits, was upon the rug, and an ill-stuffed pillow, and a worn-out cover upon the sheet.\nThe name of the carpet, and it was one of its properties that whoever was upon it no one could see him, and he could see every one. And it would retain no colour but its own.\nsat within the carpet, and they stood before them. wilt thou play chess?\nwearing a coat and a surcoat of yellow satin, and hose of thin greenish-yellow cloth upon his feet, and over his hose shoes of parti-coloured leather, fastened at the insteps with golden clasps. And they bore a heavy three-edged sword with a golden hilt, in a scabbard of black leather tipped with fine gold.\nAnd upon his feet were hose of fine Totness, and shoes of parti-coloured leather, clasped with gold, and the youth was of noble bearing, fair of face, with ruddy cheeks and large hawk's eyes\nupon a dun-coloured horse coming towards them.\nand tipped with Spanish laton. The belt of the sword was of dark green leather with golden slides and a clasp of ivory upon it, and a buckle of jet-black upon the clasp.\nA helmet of gold was on the head of the knight, set with precious stones of great virtue, and at the top of the helmet was the image of a flame- coloured leopard with two ruby-red stones in its head, so that it was astounding for a warrior, however stout his heart, to look at the face of the leopard, much more at the face of the knight.\nHe had in his hand a blue-shafted lance, but from the haft to the point it was stained crimson-red with the blood of the Ravens and their plumage.\nAnd at the top of the helmet was the figure of a flame-coloured lion, with a fiery-red tongue, issuing above a foot from his mouth, and with venomous eyes, crimson-red, in his head. \nSo they finished the game and began another; and as they were finishing that game, lo, they heard a great tumult and a clamour of armed men, and a croaking of Ravens.\nwith sparkling stones of crystal in it, and at the crest of the helmet was the figure of a griffin, with a stone of many virtues in its head. \nwater becomes crystalline stone\nunder the mountain wind where the great cold is,\nand the air always turns into the cold element there, so that water is queen\nthere, because of the cold.\nAnd it was as if gold covered their bodies / and melted the crystals\nI remember one occasion when I visited the Palace to see the procession of blue horses.\nred satin wrought with yellow silk, and yellow were the borders of their scarf.\ndost thou see the ring with a stone set in it, that is upon the Emperor's hand?" "I see it," he answered. "It is one of the properties of that stone to enable thee to remember that thou seest here to-night, and hadst thou not seen the stone, thou wouldest never have been able to remember aught thereof.”\nAnd they were clad in a coat of yellow satin, falling as low as the small of their leg, and embroidered with threads of red silk.\nThose birds, ne’er a note fell wrong,\nFor they were skilful thus, and wise;\nHearing those creatures of the skies,\nSeeing the green leaves all around,\nI was right joyful at the sound,\nSuch that there was none who knew\nThen, behold, they brought bowls of silver wherein was water to wash, and towels of linen, some green and some white; and I washed.\nand traversed the valley till they reached the green tree, where they saw the fountain, and the bowl, and the slab.\nLast year's paper fan. A night with a clear moon.\nOpening the door, that I might be,\nOf that green branched garden free.\nand their eyebrows black as jet, and such part of their wrist as could be seen between a glove and a sleeve, was whiter than the lily, and thicker than an ankle.\nAnd fressher than the may with floures newe For with the rose colour stroof hire hewe, I noot which was the fyner of hem two \nAnd with that word he caughte a greet mirour, / And saugh that chaunged was al his colour, / And saugh his visage al in another kynde. / And right anon it / …\n.. oother good array, / Now may I were an hose upon myn heed; / And wher my colour was bothe fressh and reed / Now is it wan and of a leden hewe -- / …\n.Sygrem hym told tokynnes moo thanne on, / his sonne to knowe be right of his office, / What colour was his hors he rode vppon, / And what harmys he bare, and what devise, / Al / …\n...turnesole, and dip hit in wyne, that the wyne may catch the colour thereof, and colour the potage therwith. H. Ord., p. 465, and take red turnesol …\n...otgrave. Take bleue turnesole, and dip hit in wyne, that the wyne may catch the colour thereof, and colour the potage therwith. H. Ord., p. 465, and take red …\nmoskles, a.] þat haueþ wiþ ynne hem margery perles of alle manere colour and hewe, of rody and rede, of purpur and of blew, and special|liche and moste of whyte. Þere is …\nf a redde color whom hyt hathe not naturally, but of nye places to hyt, whiche be redde like to the colour of bloode, where redde precious stones be founde. Solinus. The hilles cal …\nchaungenge their colour. tymes in oon yere; in thre mo|nethes holdenge the colour of duste, in other thre the co …\nchaungenge their colour iiij. tymes in oon yere; in thre mo|nethes holdenge the colour of duste, in other thre the coloure of bloode, in oþer thre monethes a grene coloure, and in ...\nBright are the willow-tops; playful the fish\Nature is superior to learning.\nBright the tops of the oak; bitter the ash-branches;\nSweet the cow-parsnip, the wave keeps laughing;\nThe cheek will not conceal the anguish of the heart.\nBright the tops of the oak; incessant is the tempest;\nThe bees are high; brittle the dry brushwood;\nUsual for the wanton to laugh excessively.\nLet cows be round-backed; let the wolf be gray;\Like gossamer will they press the grain at the roots.\nhad receyued the dethe vnder the grene tree he lost the grene colour and becam reed and that was in tokenyng of the blood \n...it in a large coffyne and couch in the capon or fessand hole and if ye wille smyt them in peces and colour them with saffron and put in it other wild foule if ye wille and plant ther in hard yolks of …\n.bard pouder of guinger sugur saffron and salt and let it be be tweene braun and yallowe and mak thy colour of sanders then mak a large coffyn of pured floure and put thy lampry ther in and put in the ...?\n.ed wine and alay it up then sesson it with pouder of pepper guinger and salt and let it haue a good colour of blod then tak out the smale bones of the feet and let the skyn be hole and lay a foot in a …\nCrystalle gilly: To mak cristalle gilly tak whyt wyne that will hold hir colour and boil the fishe ther in and let it stand and serve it furthe. \net brothe till it be boiled in then mak a cerip with wyne and of the same stuf and boile it upe and colour it with saffron and put ther to a quantite of venyger and salt it and serue it.\nin a mortair and alay it with the sam brothe and put ther to pouder of clowes pouder of canelle colour it with saffron boile it and serue it.\nthe whey then tak the mylk of almondes or cow creme and sett it on the fyere put ther to sugur and colour it depe with saffrone then leshe out the crud and couche it in dishes and pour out the ceripe \nwyne then chop hem and put ther to parsly and saige and put ther to poudre of pepper and granys and colour yt with saffron then tak wiht of egges and ale and draw throughe a stren and put ther to and …\nnd set it on the fiere in a pan and put there to saige leuys brok in two or in thre and parsley and colour the brothe then tak egge and grated bred and mele them to gedur. and when the pot boilithe pu\nOf aperil whan cloþed is þe mede / With new grene of lusty veer þe prime / And swote smellen floures white and rede / …\n ...tene / Or sleen hym self al be his lady faire / Nay nay / but euere in oone be fresch and grene / To serue and loue his deere hertes queene / And thynke it is / .\nA nyghtyngale vpon a cedre grene. / Vpon þe chambre wal þere as she lay. / Ful loude sang a-yen / …\nde was large and rayled alle thaleyes / And shadwed wel with blosmy bowes grene / And benched new and sonded alle þe wayes / In whiche she walketh arm in arm betwen / …\n.outward faste it gunne bi-holde / Dounward a steire & in an erber grene / Þis ilk þyng þei reddyn hem be-twene \n.... / Folwen ful ofte a merye someres day. / And after wynter folweth grene may. / Men sen alday and reden ek in storyes. / That after sharpe shoures ben victor / …\n..we / Follwen ful oft a merye someres day / And efter wynter folweth grene may / Men sen alday and reden ek in storyes / Þat efter sharpe shoures ben victories / …\nat han in wyntir ded ben & drye / Reuestyn hem in grene whan þat may is / Whan euery lusty lest / ...\na merie someris day / And aftyr wyntyr folwyþ grene may / ffolk sen alday & redyn ek in storijs / Þat aftyr / ..\na mery somers day / And afftyr wynter foloyth grene may / For men seyn al day. and Rede eke in storys / That aftyr sharpe schoures ben v /`;
