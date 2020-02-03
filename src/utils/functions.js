export const repositionImage = (payload) => {
    let { page_index, image_no, xPos, yPos, currentX, currentY } = payload;
    if (page_index === '0')
        page_index = 0;

    // check if the top left currentX and currentY value is undefined or not.
    // if not undefined then update the value properly
    let pages = [];
    if (localStorage.getItem('photo_book')) {
        let photo_book = JSON.parse(localStorage.getItem('photo_book'));
        pages = photo_book.pages;

        if (yPos != null && typeof yPos !== 'undefined')
            pages[page_index][image_no].top = yPos;

        if (xPos != null && typeof xPos !== 'undefined')
            pages[page_index][image_no].left = xPos;

        if (currentX != null && typeof currentX !== 'undefined')
            pages[page_index][image_no].currentX = currentX;

        if (currentY != null && typeof currentY !== 'undefined')
            pages[page_index][image_no].currentY = currentY;

        photo_book.pages = pages;
        localStorage.setItem('photo_book', JSON.stringify(photo_book));
    }

};
// ******************* TEXT ALIGNMENT STEPS ***********************

// 1. split the textbox text at \n newline point and store it a variable sentences
// 2. loop through sentences
// 3. check if the entered character is greater than line_length ( if yes step-4)
// 4. split the sentence into words array and put it into a variable words
// 5. remove the last word and store in a varible word_to_shift
// 6. now join the words and build the sentence again
// 7. check the sentence total characters with the line_length
// 8. if total character is greate than line_length then do line_length - total character and put in a variable call remaining_characters
// 9. now at last of the sentence add the remaining characters with white space.
// 10. now word_to_shift variable concatenate with the next sentence
// ***************** Repeate the process until finish all the sentences ********************

export const alignText = (text, line_length) => {
    // html textarea uses \r\n as the by default line breaking tag

    let brExp = /\r\n/i;
    let sentences = text.split(brExp);

    let add_sentence = false;
    let add_word = '';
    for (let i = 0; i < sentences.length; i++) {
        if (sentences[i].length > line_length) {
            let words = sentences[i].split(' ');
            let word_to_shift = words.pop();
            let new_sentence = words.join(' ');

            if (new_sentence.length < line_length) {
                let remaining_characters = line_length - new_sentence.length;
                // generate the white space with the given length
                // You have to add 1 to the desired length because the separator string goes between the array elements.
                var spaces = new Array(remaining_characters + 1).join(' ');
                new_sentence = new_sentence + spaces;
                // store the new_sentence into the sentences[i].
                sentences[i] = new_sentence;
            }
            // check if there is another sentence concatenate the word_to_shift with sentences[i+1]
            // else push the word_to_shift into the sentences array
            if (i < sentences.length - 1) { sentences[i + 1] = word_to_shift + sentences[i + 1] }
            else {
                add_sentence = true;
                add_word = word_to_shift;
            }

        }
    }
    if (add_sentence) sentences.push(add_word);
    // finally join the sentences into a single sentence
    let final_sentence = sentences.join("\r\n");
    return final_sentence;
}


export const textAlignment = (text, line_length) => {
    // ********************** Algorithm for text alignment *************************
    // maximum character length in a line is line_length
    // split the string by <br>
    // now check if there is splited sentences in the array or not
    // if splited sentences array is not empty then take the last array element
    // before updating the new string first check how many characters in that line.
    // if the characters exced the maximum length then import the <br> before the last word
    // if splited sentences array is empty then process the original string
    let original_string = text;
    let MAX_LINE_LENGTH = line_length;
    let final_string = original_string;
    let brExp = /\n/i;
    // let brExp = /<br\s*\/?>/i;
    let splited_sentences = original_string.split(brExp);
    if (splited_sentences.length === 1) {
        if (original_string.length > MAX_LINE_LENGTH) {
            // put a break before the word 64 character
            let splited_words = original_string.split(" ");
            // remove the last word and store in a variable
            let last_word = splited_words.pop();
            // join the string again using ' ' seperator
            let sentence_without_last_word = splited_words.join(" ");
            final_string = sentence_without_last_word + '\n' + last_word;

        }
    } else {
        // take the last sentence from the splited_sentences array
        let processing_string = splited_sentences.pop();
        // check if the total number of character in the sentence is less than line_length characters or not
        if (processing_string.length > MAX_LINE_LENGTH) {
            // put a break before the word line_length character
            let splited_words = processing_string.split(" ");
            // remove the last word and store in a variable
            let last_word = splited_words.pop();
            // join the string again using ' ' seperator
            let sentence_without_last_word = splited_words.join(" ");
            let final_sentence = sentence_without_last_word + '\n' + last_word;
            let sentences_without_last_sentence = splited_sentences.join("\n");
            final_string = sentences_without_last_sentence + '\n' + final_sentence;
        }
        // if the sentence is greater than line_length characters than put a break before the last word.
    }
    return final_string;
}
