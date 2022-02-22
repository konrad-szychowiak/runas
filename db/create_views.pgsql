drop view if exists entry;
create view entry(id, lemma, definition, pos, spelling_id, pos_id) as
SELECT lexeme.lexeme_id      AS id,
       s.spelling            AS lemma,
       lexeme.definition,
       pos.name              AS pos,
       s.word_id             AS spelling_id,
       lexeme.part_of_speech AS pos_id
FROM lexeme
         JOIN spelling s ON lexeme.spelling = s.word_id
         JOIN part_of_speech pos ON lexeme.part_of_speech = pos.pos_id;
