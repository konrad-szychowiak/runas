import {sql} from "./src/db.js";
import axios from 'axios'

async function setup() {
    await sql`insert into part_of_speech (name)
              values ('noun'),
                     ('verb'),
                     ('adjective'),
                     ('pronoun');`

    await sql`insert into paradigm_category (part_of_speech, name)
              values ((select pos_id from part_of_speech where part_of_speech.name = 'noun'), 'singular'),
                     ((select pos_id from part_of_speech where part_of_speech.name = 'noun'), 'plural'),
                     ((select pos_id from part_of_speech where part_of_speech.name = 'verb'), 'infinitive'),
                     ((select pos_id from part_of_speech where part_of_speech.name = 'verb'), 'present'),
                     ((select pos_id from part_of_speech where part_of_speech.name = 'verb'), 'past'),
                     ((select pos_id from part_of_speech where part_of_speech.name = 'adjective'), 'singular'),
                     ((select pos_id from part_of_speech where part_of_speech.name = 'adjective'), 'plural'),
                     ((select pos_id from part_of_speech where part_of_speech.name = 'pronoun'), 'base form');`

}

// await setup();
console.log('LEXEME')
console.log('  lemma (spelling) >_')
console.log('  definition (varchar 50) >_')
console.log('  choose part of speech:')

const PoSs = await axios.get('http://localhost:8080/api/pos/')
PoSs.data.forEach(async el => {
    const {pos_id, name} = el;
    console.log(`  (${pos_id}) ${name}`)
})

console.error('--chosen "noun"...')
const cats = await axios.get(`http://localhost:8080/api/pos/${PoSs.data[0].pos_id}/category/`)
cats.data.forEach(el => {
    console.log(`  noun.${el.name} (varchar 50) >_`)
})
