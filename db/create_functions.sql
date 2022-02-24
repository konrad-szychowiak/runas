drop function if exists branch_off_spelling;

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