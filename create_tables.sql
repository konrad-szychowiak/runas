drop table if exists belonging;
drop table if exists syntactic_group;
drop table if exists morphological_group;
drop table if exists "group";
drop table if exists inflected_form;
drop table if exists exemplified_by;
drop table if exists use_example;
drop table if exists contextualised_by;
drop table if exists context;
drop table if exists lexeme;
drop table if exists paradigm_category;
drop table if exists part_of_speech;
drop table if exists spelling;

create table spelling
(
    word_id  serial primary key,
    spelling varchar(50) not null
);

create table part_of_speech
(
    pos_id      serial primary key,
    name        varchar(50) not null,
    description varchar(50) null
);

create table paradigm_category
(
    category_id    serial primary key,
    part_of_speech int references part_of_speech (pos_id),
    name           varchar(50) not null
);

create table lexeme
(
    lexeme_id      serial primary key,
    part_of_speech int references part_of_speech (pos_id),
    spelling       int references spelling (word_id),
    definition     varchar(50) not null
);

create table context
(
    context_id  serial primary key,
    name        varchar(50) not null,
    description varchar(50) null
);

create table contextualised_by
(
    lexeme  int references lexeme (lexeme_id),
    context int references context (context_id),
    primary key (lexeme, context)
);

create table use_example
(
    example_id serial primary key,
    text       varchar(50) not null,
    -- TODO: rename `source_ref` -> `source`
    source_ref varchar(50) null
);

create table exemplified_by
(
    lexeme  int references lexeme (lexeme_id),
    example int references use_example (example_id),
    primary key (lexeme, example)
);

create table inflected_form
(
    lexeme   int references lexeme (lexeme_id),
    category int references paradigm_category (category_id),
    spelling int references spelling (word_id),
    primary key (lexeme, category, spelling)
);

create table "group"
(
    group_id    serial primary key,
    description varchar(50) not null
);

create table morphological_group
(
    group_id int primary key references "group" (group_id),
    core     int references lexeme (lexeme_id)
);

create table syntactic_group
(
    group_id int primary key references "group" (group_id),
    meaning  varchar(100) not null
);

create table belonging
(
    lexeme  int references lexeme (lexeme_id),
    "group" int references "group" (group_id),
    primary key (lexeme, "group")
);
