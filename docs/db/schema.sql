--
-- PostgreSQL database dump
--

-- Dumped from database version 18.2 (Postgres.app)
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: sim_attempt_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.sim_attempt_status AS ENUM (
    'in_progress',
    'passed',
    'failed',
    'abandoned'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: class_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.class_members (
    class_id integer NOT NULL,
    user_id integer NOT NULL,
    role text DEFAULT 'student'::text NOT NULL
);


--
-- Name: classes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.classes (
    id integer NOT NULL,
    teacher_id integer NOT NULL,
    name text NOT NULL,
    join_code text NOT NULL
);


--
-- Name: classes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.classes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: classes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.classes_id_seq OWNED BY public.classes.id;


--
-- Name: sim_attempt_step_mistakes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sim_attempt_step_mistakes (
    attempt_id integer NOT NULL,
    step_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: sim_attempt_steps; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sim_attempt_steps (
    id integer NOT NULL,
    attempt_id integer NOT NULL,
    step_id integer NOT NULL,
    chosen_index integer NOT NULL,
    is_correct boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT sim_attempt_steps_chosen_index_check CHECK ((chosen_index >= 0))
);


--
-- Name: sim_attempt_steps_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sim_attempt_steps_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sim_attempt_steps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sim_attempt_steps_id_seq OWNED BY public.sim_attempt_steps.id;


--
-- Name: sim_attempts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sim_attempts (
    id integer NOT NULL,
    user_id integer NOT NULL,
    class_id integer,
    scenario_id integer NOT NULL,
    status public.sim_attempt_status DEFAULT 'in_progress'::public.sim_attempt_status NOT NULL,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    ended_at timestamp with time zone,
    correct_count integer DEFAULT 0 NOT NULL,
    total_answered integer DEFAULT 0 NOT NULL,
    mistakes integer DEFAULT 0 NOT NULL
);


--
-- Name: sim_attempts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sim_attempts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sim_attempts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sim_attempts_id_seq OWNED BY public.sim_attempts.id;


--
-- Name: sim_levels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sim_levels (
    id integer NOT NULL,
    level_number integer NOT NULL,
    title text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT sim_levels_level_number_check CHECK ((level_number >= 1))
);


--
-- Name: sim_levels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sim_levels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sim_levels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sim_levels_id_seq OWNED BY public.sim_levels.id;


--
-- Name: sim_scenarios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sim_scenarios (
    id integer NOT NULL,
    level_id integer NOT NULL,
    scenario_number integer NOT NULL,
    title text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT sim_scenarios_scenario_number_check CHECK ((scenario_number >= 1))
);


--
-- Name: sim_scenarios_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sim_scenarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sim_scenarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sim_scenarios_id_seq OWNED BY public.sim_scenarios.id;


--
-- Name: sim_steps; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sim_steps (
    id integer NOT NULL,
    scenario_id integer NOT NULL,
    step_number integer NOT NULL,
    title text DEFAULT ''::text NOT NULL,
    body_text text DEFAULT ''::text NOT NULL,
    prompt_text text DEFAULT ''::text NOT NULL,
    choices jsonb DEFAULT '[]'::jsonb NOT NULL,
    correct_index integer,
    correct_feedback text DEFAULT ''::text NOT NULL,
    incorrect_feedback text DEFAULT ''::text NOT NULL,
    incorrect_game_over boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT sim_steps_check CHECK (((correct_index IS NULL) OR ((jsonb_typeof(choices) = 'array'::text) AND (jsonb_array_length(choices) > 0) AND (correct_index >= 0)))),
    CONSTRAINT sim_steps_step_number_check CHECK ((step_number >= 1))
);


--
-- Name: sim_steps_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sim_steps_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sim_steps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sim_steps_id_seq OWNED BY public.sim_steps.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    teacher boolean DEFAULT false NOT NULL,
    first_name text,
    last_name text,
    student_id text,
    phone_number text
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: classes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classes ALTER COLUMN id SET DEFAULT nextval('public.classes_id_seq'::regclass);


--
-- Name: sim_attempt_steps id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sim_attempt_steps ALTER COLUMN id SET DEFAULT nextval('public.sim_attempt_steps_id_seq'::regclass);


--
-- Name: sim_attempts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sim_attempts ALTER COLUMN id SET DEFAULT nextval('public.sim_attempts_id_seq'::regclass);


--
-- Name: sim_levels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sim_levels ALTER COLUMN id SET DEFAULT nextval('public.sim_levels_id_seq'::regclass);


--
-- Name: sim_scenarios id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sim_scenarios ALTER COLUMN id SET DEFAULT nextval('public.sim_scenarios_id_seq'::regclass);


--
-- Name: sim_steps id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sim_steps ALTER COLUMN id SET DEFAULT nextval('public.sim_steps_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: class_members class_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.class_members
    ADD CONSTRAINT class_members_pkey PRIMARY KEY (class_id, user_id);


--
-- Name: classes classes_join_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_join_code_key UNIQUE (join_code);


--
-- Name: classes classes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_pkey PRIMARY KEY (id);


--
-- Name: sim_attempt_step_mistakes sim_attempt_step_mistakes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sim_attempt_step_mistakes
    ADD CONSTRAINT sim_attempt_step_mistakes_pkey PRIMARY KEY (attempt_id, step_id);


--
-- Name: sim_attempt_steps sim_attempt_steps_attempt_id_step_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sim_attempt_steps
    ADD CONSTRAINT sim_attempt_steps_attempt_id_step_id_key UNIQUE (attempt_id, step_id);


--
-- Name: sim_attempt_steps sim_attempt_steps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sim_attempt_steps
    ADD CONSTRAINT sim_attempt_steps_pkey PRIMARY KEY (id);


--
-- Name: sim_attempts sim_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sim_attempts
    ADD CONSTRAINT sim_attempts_pkey PRIMARY KEY (id);


--
-- Name: sim_levels sim_levels_level_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sim_levels
    ADD CONSTRAINT sim_levels_level_number_key UNIQUE (level_number);


--
-- Name: sim_levels sim_levels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sim_levels
    ADD CONSTRAINT sim_levels_pkey PRIMARY KEY (id);


--
-- Name: sim_scenarios sim_scenarios_level_id_scenario_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sim_scenarios
    ADD CONSTRAINT sim_scenarios_level_id_scenario_number_key UNIQUE (level_id, scenario_number);


--
-- Name: sim_scenarios sim_scenarios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sim_scenarios
    ADD CONSTRAINT sim_scenarios_pkey PRIMARY KEY (id);


--
-- Name: sim_steps sim_steps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sim_steps
    ADD CONSTRAINT sim_steps_pkey PRIMARY KEY (id);


--
-- Name: sim_steps sim_steps_scenario_id_step_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sim_steps
    ADD CONSTRAINT sim_steps_scenario_id_step_number_key UNIQUE (scenario_id, step_number);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_attempt_steps_attempt; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_attempt_steps_attempt ON public.sim_attempt_steps USING btree (attempt_id);


--
-- Name: idx_attempts_scenario; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_attempts_scenario ON public.sim_attempts USING btree (scenario_id);


--
-- Name: idx_attempts_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_attempts_user ON public.sim_attempts USING btree (user_id);


--
-- Name: idx_sim_scenarios_level; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sim_scenarios_level ON public.sim_scenarios USING btree (level_id);


--
-- Name: idx_sim_steps_scenario; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sim_steps_scenario ON public.sim_steps USING btree (scenario_id);


--
-- Name: class_members class_members_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.class_members
    ADD CONSTRAINT class_members_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE;


--
-- Name: class_members class_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.class_members
    ADD CONSTRAINT class_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: classes classes_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: sim_attempt_step_mistakes sim_attempt_step_mistakes_attempt_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sim_attempt_step_mistakes
    ADD CONSTRAINT sim_attempt_step_mistakes_attempt_id_fkey FOREIGN KEY (attempt_id) REFERENCES public.sim_attempts(id) ON DELETE CASCADE;


--
-- Name: sim_attempt_step_mistakes sim_attempt_step_mistakes_step_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sim_attempt_step_mistakes
    ADD CONSTRAINT sim_attempt_step_mistakes_step_id_fkey FOREIGN KEY (step_id) REFERENCES public.sim_steps(id) ON DELETE CASCADE;


--
-- Name: sim_attempt_steps sim_attempt_steps_attempt_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sim_attempt_steps
    ADD CONSTRAINT sim_attempt_steps_attempt_id_fkey FOREIGN KEY (attempt_id) REFERENCES public.sim_attempts(id) ON DELETE CASCADE;


--
-- Name: sim_attempt_steps sim_attempt_steps_step_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sim_attempt_steps
    ADD CONSTRAINT sim_attempt_steps_step_id_fkey FOREIGN KEY (step_id) REFERENCES public.sim_steps(id) ON DELETE CASCADE;


--
-- Name: sim_attempts sim_attempts_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sim_attempts
    ADD CONSTRAINT sim_attempts_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE SET NULL;


--
-- Name: sim_attempts sim_attempts_scenario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sim_attempts
    ADD CONSTRAINT sim_attempts_scenario_id_fkey FOREIGN KEY (scenario_id) REFERENCES public.sim_scenarios(id) ON DELETE CASCADE;


--
-- Name: sim_attempts sim_attempts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sim_attempts
    ADD CONSTRAINT sim_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: sim_scenarios sim_scenarios_level_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sim_scenarios
    ADD CONSTRAINT sim_scenarios_level_id_fkey FOREIGN KEY (level_id) REFERENCES public.sim_levels(id) ON DELETE CASCADE;


--
-- Name: sim_steps sim_steps_scenario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sim_steps
    ADD CONSTRAINT sim_steps_scenario_id_fkey FOREIGN KEY (scenario_id) REFERENCES public.sim_scenarios(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--
