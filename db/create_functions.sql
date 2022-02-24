drop function if exists branch_off_spelling;
drop procedure if exists reflect_paradigm_update_on_existing;

create or replace function branch_off_spelling(word text)
    returns spelling.word_id%TYPE
    language plpgsql
as
$$
declare
    id spelling.word_id%TYPE;
begin
    if exists(select from spelling where spelling.spelling = word) then
        select word_id into id from spelling where spelling.spelling = word;
    else
        insert into spelling (spelling) values (word) returning word_id into id;
    end if;
    return id;
end;
$$;

create or replace procedure reflect_paradigm_update_on_existing(
    pos inflected_form.category%TYPE
)
    language plpgsql
as
$$
declare
    lex              int;
    cat              int;
    unknown_spelling int;
begin

    select branch_off_spelling('???') into unknown_spelling;

    for lex in
        select lexeme_id from lexeme where part_of_speech = pos
        loop
            -- we have every lexeme in the part of speech identified by `pos`
            raise notice 'Hello %', lex;
            -- add placeholder ones to the new things
            for cat in
                select category_id
                from paradigm_category
                where part_of_speech = pos
                loop
                    if not exists(select from inflected_form where category = cat and lexeme = lex) then
                        insert into inflected_form (lexeme, category, spelling)
                        values (lex, cat, unknown_spelling);
                    end if;
                end loop;
        end loop;

end
$$;