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

DROP DOMAIN IF EXISTS description;
CREATE DOMAIN description as varchar(100);

create table spelling
(
    word_id  serial primary key,
    spelling varchar(50) not null
);

create table part_of_speech
(
    pos_id      serial primary key,
    name        varchar(50) not null,
    description description null
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
    lexeme  int references lexeme (lexeme_id) ON DELETE CASCADE,
    context int references context (context_id) ON DELETE CASCADE,
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
    example int references use_example (example_id) ON DELETE CASCADE,
    primary key (lexeme, example)
);

CREATE TABLE inflected_form
(
    lexeme   int REFERENCES lexeme (lexeme_id) ON DELETE CASCADE,
    category int REFERENCES paradigm_category (category_id),
    spelling int REFERENCES spelling (word_id),
    PRIMARY KEY (lexeme, category, spelling)
);

create table "group"
(
    group_id    serial primary key,
    description varchar(50) not null
);

create table morphological_group
(
    group_id int primary key references "group" (group_id) on delete cascade not null,
--     fixme: what to do, when lexeme is deleted?
    core     int references lexeme (lexeme_id) on delete cascade             not null
);

create table semantic_group
(
    group_id int primary key references "group" (group_id) on delete cascade,
    meaning  varchar(100) not null
);

create table belonging
(
    lexeme  int references lexeme (lexeme_id) ON DELETE CASCADE,
    "group" int references "group" (group_id),
    primary key (lexeme, "group")
);

-- views

drop view if exists full_morphological_group_view;
create view full_morphological_group_view as
select group_id        as id,
       description,
       core,
       'morphological' as group_type
from "group" g
         join morphological_group mg using (group_id);

drop view if exists full_semantic_group_view;
create view full_semantic_group_view as
select group_id   as id,
       description,
       meaning,
       'semantic' as group_type
from "group" g
         join semantic_group mg using (group_id);