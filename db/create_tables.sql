drop table if exists belonging;
drop table if exists semantic_group cascade ;
drop table if exists morphological_group cascade ;
drop table if exists "group";
drop table if exists inflected_form;
drop table if exists exemplified_by;
drop table if exists use_example;
drop table if exists contextualised_by;
drop table if exists context;
drop table if exists lexeme cascade;
drop table if exists paradigm_category;
drop table if exists part_of_speech;
drop table if exists spelling;

create table spelling
(
    word_id  serial primary key,
    spelling text not null
);

create table part_of_speech
(
    pos_id      serial primary key,
    name        text not null,
    description text null
);

create table paradigm_category
(
    category_id    serial primary key,
    part_of_speech int references part_of_speech (pos_id) on delete cascade,
    name           text not null
);

create table lexeme
(
    lexeme_id      serial primary key,
    part_of_speech int references part_of_speech (pos_id) on delete cascade,
    spelling       int references spelling (word_id) on delete cascade,
    definition     text not null
);

create table context
(
    context_id  serial primary key,
    name        text not null,
    description text null
);

create table contextualised_by
(
    lexeme  int references lexeme (lexeme_id) ON DELETE CASCADE,
    context int references context (context_id) ON DELETE CASCADE,
    primary key (lexeme, context)
);

create table use_example
(
    example_id serial primary key,
    text       text not null,
    source_ref text null
);

create table exemplified_by
(
    lexeme  int references lexeme (lexeme_id) on delete cascade,
    example int references use_example (example_id) ON DELETE CASCADE,
    primary key (lexeme, example)
);

CREATE TABLE inflected_form
(
    lexeme   int REFERENCES lexeme (lexeme_id) ON DELETE CASCADE,
    category int REFERENCES paradigm_category (category_id) on delete cascade,
    spelling int REFERENCES spelling (word_id) on delete cascade,
    PRIMARY KEY (lexeme, category, spelling)
);

create table "group"
(
    group_id    serial primary key,
    description text not null
);

create table morphological_group
(
    group_id int primary key references "group" (group_id) on delete cascade not null,
    core     int references lexeme (lexeme_id) on delete cascade             not null
);

create table semantic_group
(
    group_id int primary key references "group" (group_id) on delete cascade,
    meaning  text not null
);

create table belonging
(
    lexeme  int references lexeme (lexeme_id) ON DELETE CASCADE,
    "group" int references "group" (group_id) on delete cascade,
    primary key (lexeme, "group")
);