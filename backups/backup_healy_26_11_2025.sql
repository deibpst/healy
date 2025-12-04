--
-- PostgreSQL database dump
--

\restrict r4KTdQDa7l9vfsg6FPUtJ3EYtZAdLAFDeqIHClvRbacMzgkrAN5OHTIuxmY5dgZ

-- Dumped from database version 17.5 (aa1f746)
-- Dumped by pg_dump version 18.1

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

ALTER TABLE ONLY public.paciente DROP CONSTRAINT fk_paciente_usuario;
ALTER TABLE ONLY public.horario_fisioterapeuta DROP CONSTRAINT fk_horario_fisio;
ALTER TABLE ONLY public.fisioterapeuta DROP CONSTRAINT fk_fisio_usuario;
ALTER TABLE ONLY public.fisioterapeuta DROP CONSTRAINT fk_fisio_especialidad;
ALTER TABLE ONLY public.estado_consulta DROP CONSTRAINT fk_estado_consulta_estado;
ALTER TABLE ONLY public.chat_interaccion DROP CONSTRAINT fk_chat_paciente;
DROP INDEX neon_auth.users_sync_deleted_at_idx;
ALTER TABLE ONLY public.usuarios DROP CONSTRAINT usuarios_pkey;
ALTER TABLE ONLY public.usuarios DROP CONSTRAINT usuarios_email_key;
ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_email_key;
ALTER TABLE ONLY public.usuario DROP CONSTRAINT pk_usuario;
ALTER TABLE ONLY public.paciente DROP CONSTRAINT pk_paciente;
ALTER TABLE ONLY public.horario_fisioterapeuta DROP CONSTRAINT pk_horario_fisioterapeuta;
ALTER TABLE ONLY public.fisioterapeuta DROP CONSTRAINT pk_fisioterapeuta;
ALTER TABLE ONLY public.estado_tipo DROP CONSTRAINT pk_estado_tipo;
ALTER TABLE ONLY public.estado_consulta DROP CONSTRAINT pk_estado_consulta;
ALTER TABLE ONLY public.especializacion DROP CONSTRAINT pk_especializacion;
ALTER TABLE ONLY public.ejercicio DROP CONSTRAINT pk_ejercicio;
ALTER TABLE ONLY public.chat_interaccion DROP CONSTRAINT pk_chat_interaccion;
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_pkey";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key";
ALTER TABLE ONLY neon_auth.users_sync DROP CONSTRAINT users_sync_pkey;
ALTER TABLE public.usuario ALTER COLUMN usuario_id DROP DEFAULT;
ALTER TABLE public.paciente ALTER COLUMN paciente_id DROP DEFAULT;
ALTER TABLE public.horario_fisioterapeuta ALTER COLUMN horario_id DROP DEFAULT;
ALTER TABLE public.fisioterapeuta ALTER COLUMN fisio_id DROP DEFAULT;
ALTER TABLE public.estado_tipo ALTER COLUMN estado_id DROP DEFAULT;
ALTER TABLE public.estado_consulta ALTER COLUMN estado_consulta_id DROP DEFAULT;
ALTER TABLE public.especializacion ALTER COLUMN especialidad_id DROP DEFAULT;
ALTER TABLE public.ejercicio ALTER COLUMN ejercicio_id DROP DEFAULT;
ALTER TABLE public.chat_interaccion ALTER COLUMN mensaje_id DROP DEFAULT;
DROP TABLE public.usuarios;
DROP SEQUENCE public.usuario_usuario_id_seq;
DROP TABLE public.usuario;
DROP SEQUENCE public.paciente_paciente_id_seq;
DROP TABLE public.paciente;
DROP SEQUENCE public.horario_fisioterapeuta_horario_id_seq;
DROP TABLE public.horario_fisioterapeuta;
DROP SEQUENCE public.fisioterapeuta_fisio_id_seq;
DROP TABLE public.fisioterapeuta;
DROP SEQUENCE public.estado_tipo_estado_id_seq;
DROP TABLE public.estado_tipo;
DROP SEQUENCE public.estado_consulta_estado_consulta_id_seq;
DROP TABLE public.estado_consulta;
DROP SEQUENCE public.especializacion_especialidad_id_seq;
DROP TABLE public.especializacion;
DROP SEQUENCE public.ejercicio_ejercicio_id_seq;
DROP TABLE public.ejercicio;
DROP SEQUENCE public.chat_interaccion_mensaje_id_seq;
DROP TABLE public.chat_interaccion;
DROP TABLE public."Users";
DROP TABLE neon_auth.users_sync;
DROP FUNCTION pgrst.pre_config();
DROP TYPE public.enum_usuarios_role;
DROP TYPE public.enum_usuario_role;
DROP TYPE public.enum_users_role;
DROP TYPE public."enum_Users_role";
DROP SCHEMA pgrst;
DROP SCHEMA neon_auth;
DROP EXTENSION pg_session_jwt;
-- *not* dropping schema, since initdb creates it
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- Name: pg_session_jwt; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_session_jwt WITH SCHEMA public;


--
-- Name: EXTENSION pg_session_jwt; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_session_jwt IS 'pg_session_jwt: manage authentication sessions using JWTs';


--
-- Name: neon_auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA neon_auth;


--
-- Name: pgrst; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA pgrst;


--
-- Name: enum_Users_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_Users_role" AS ENUM (
    'paciente',
    'fisioterapeuta'
);


--
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_users_role AS ENUM (
    'paciente',
    'fisioterapeuta'
);


--
-- Name: enum_usuario_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_usuario_role AS ENUM (
    'paciente',
    'fisioterapeuta'
);


--
-- Name: enum_usuarios_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_usuarios_role AS ENUM (
    'paciente',
    'fisioterapeuta'
);


--
-- Name: pre_config(); Type: FUNCTION; Schema: pgrst; Owner: -
--

CREATE FUNCTION pgrst.pre_config() RETURNS void
    LANGUAGE sql
    AS $$
  SELECT
      set_config('pgrst.db_schemas', 'public', true)
    , set_config('pgrst.db_aggregates_enabled', 'true', true)
    , set_config('pgrst.db_anon_role', 'anonymous', true)
    , set_config('pgrst.jwt_role_claim_key', '.role', true)
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: users_sync; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth.users_sync (
    raw_json jsonb NOT NULL,
    id text GENERATED ALWAYS AS ((raw_json ->> 'id'::text)) STORED NOT NULL,
    name text GENERATED ALWAYS AS ((raw_json ->> 'display_name'::text)) STORED,
    email text GENERATED ALWAYS AS ((raw_json ->> 'primary_email'::text)) STORED,
    created_at timestamp with time zone GENERATED ALWAYS AS (to_timestamp((trunc((((raw_json ->> 'signed_up_at_millis'::text))::bigint)::double precision) / (1000)::double precision))) STORED,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


--
-- Name: Users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Users" (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    phone character varying(255) NOT NULL,
    role public."enum_Users_role" NOT NULL,
    cedula character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: chat_interaccion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_interaccion (
    mensaje_id integer NOT NULL,
    paciente_id integer NOT NULL,
    emisor character varying(50) NOT NULL,
    mensaje text NOT NULL,
    fecha_hora timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    etapa_conversacion character varying(50) NOT NULL
);


--
-- Name: chat_interaccion_mensaje_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chat_interaccion_mensaje_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chat_interaccion_mensaje_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chat_interaccion_mensaje_id_seq OWNED BY public.chat_interaccion.mensaje_id;


--
-- Name: ejercicio; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ejercicio (
    ejercicio_id integer NOT NULL,
    descripcion character varying(300),
    nombre character varying(100)
);


--
-- Name: ejercicio_ejercicio_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ejercicio_ejercicio_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ejercicio_ejercicio_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ejercicio_ejercicio_id_seq OWNED BY public.ejercicio.ejercicio_id;


--
-- Name: especializacion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.especializacion (
    especialidad_id integer NOT NULL,
    nombre_especialidad character varying(50) NOT NULL,
    descripcion character varying(50)
);


--
-- Name: especializacion_especialidad_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.especializacion_especialidad_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: especializacion_especialidad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.especializacion_especialidad_id_seq OWNED BY public.especializacion.especialidad_id;


--
-- Name: estado_consulta; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.estado_consulta (
    estado_consulta_id integer NOT NULL,
    estado_id integer NOT NULL,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    observaciones text
);


--
-- Name: estado_consulta_estado_consulta_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.estado_consulta_estado_consulta_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: estado_consulta_estado_consulta_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.estado_consulta_estado_consulta_id_seq OWNED BY public.estado_consulta.estado_consulta_id;


--
-- Name: estado_tipo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.estado_tipo (
    estado_id integer NOT NULL,
    nombre_estado character varying(30) NOT NULL
);


--
-- Name: estado_tipo_estado_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.estado_tipo_estado_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: estado_tipo_estado_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.estado_tipo_estado_id_seq OWNED BY public.estado_tipo.estado_id;


--
-- Name: fisioterapeuta; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fisioterapeuta (
    fisio_id integer NOT NULL,
    usuario_id integer NOT NULL,
    especialidad_id integer NOT NULL,
    horario_inicio time without time zone NOT NULL,
    horario_fin time without time zone NOT NULL,
    dias_atencion character varying(50) NOT NULL
);


--
-- Name: fisioterapeuta_fisio_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.fisioterapeuta_fisio_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: fisioterapeuta_fisio_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.fisioterapeuta_fisio_id_seq OWNED BY public.fisioterapeuta.fisio_id;


--
-- Name: horario_fisioterapeuta; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.horario_fisioterapeuta (
    horario_id integer NOT NULL,
    fisio_id integer NOT NULL,
    fecha date NOT NULL,
    hora_inicio time without time zone NOT NULL,
    hora_fin time without time zone NOT NULL,
    disponible boolean DEFAULT true
);


--
-- Name: horario_fisioterapeuta_horario_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.horario_fisioterapeuta_horario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: horario_fisioterapeuta_horario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.horario_fisioterapeuta_horario_id_seq OWNED BY public.horario_fisioterapeuta.horario_id;


--
-- Name: paciente; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.paciente (
    paciente_id integer NOT NULL,
    usuario_id integer NOT NULL,
    edad integer NOT NULL,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ultima_interaccion timestamp without time zone
);


--
-- Name: paciente_paciente_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.paciente_paciente_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: paciente_paciente_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.paciente_paciente_id_seq OWNED BY public.paciente.paciente_id;


--
-- Name: usuario; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuario (
    usuario_id integer NOT NULL,
    nombre character varying(60) NOT NULL,
    apellidos character varying(60) NOT NULL,
    email character varying(100) NOT NULL,
    telefono character varying(15),
    rol character varying(20) NOT NULL,
    "contrase¤a" character varying(200) NOT NULL,
    fecha_registro date DEFAULT CURRENT_DATE NOT NULL
);


--
-- Name: usuario_usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.usuario_usuario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: usuario_usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.usuario_usuario_id_seq OWNED BY public.usuario.usuario_id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuarios (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    phone character varying(255) NOT NULL,
    role public.enum_usuarios_role NOT NULL,
    cedula character varying(255)
);


--
-- Name: chat_interaccion mensaje_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_interaccion ALTER COLUMN mensaje_id SET DEFAULT nextval('public.chat_interaccion_mensaje_id_seq'::regclass);


--
-- Name: ejercicio ejercicio_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ejercicio ALTER COLUMN ejercicio_id SET DEFAULT nextval('public.ejercicio_ejercicio_id_seq'::regclass);


--
-- Name: especializacion especialidad_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.especializacion ALTER COLUMN especialidad_id SET DEFAULT nextval('public.especializacion_especialidad_id_seq'::regclass);


--
-- Name: estado_consulta estado_consulta_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estado_consulta ALTER COLUMN estado_consulta_id SET DEFAULT nextval('public.estado_consulta_estado_consulta_id_seq'::regclass);


--
-- Name: estado_tipo estado_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estado_tipo ALTER COLUMN estado_id SET DEFAULT nextval('public.estado_tipo_estado_id_seq'::regclass);


--
-- Name: fisioterapeuta fisio_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fisioterapeuta ALTER COLUMN fisio_id SET DEFAULT nextval('public.fisioterapeuta_fisio_id_seq'::regclass);


--
-- Name: horario_fisioterapeuta horario_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.horario_fisioterapeuta ALTER COLUMN horario_id SET DEFAULT nextval('public.horario_fisioterapeuta_horario_id_seq'::regclass);


--
-- Name: paciente paciente_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.paciente ALTER COLUMN paciente_id SET DEFAULT nextval('public.paciente_paciente_id_seq'::regclass);


--
-- Name: usuario usuario_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario ALTER COLUMN usuario_id SET DEFAULT nextval('public.usuario_usuario_id_seq'::regclass);


--
-- Data for Name: users_sync; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY neon_auth.users_sync (raw_json, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Users" (id, name, email, password, phone, role, cedula, "createdAt", "updatedAt") FROM stdin;
4442a7ca-eb81-472f-8e7d-f917f780e01a	Valeria Elizabeth Rojo Hernández	v292005@gmail.com	$2a$10$Q1NcRa4EDXlb/YrMaPvqruGYcJBxsl391pBFnOvFjQT1/p472qeF.	2215257580	paciente	\N	2025-11-21 18:01:35.536+00	2025-11-21 18:01:35.536+00
\.


--
-- Data for Name: chat_interaccion; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.chat_interaccion (mensaje_id, paciente_id, emisor, mensaje, fecha_hora, etapa_conversacion) FROM stdin;
\.


--
-- Data for Name: ejercicio; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ejercicio (ejercicio_id, descripcion, nombre) FROM stdin;
\.


--
-- Data for Name: especializacion; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.especializacion (especialidad_id, nombre_especialidad, descripcion) FROM stdin;
\.


--
-- Data for Name: estado_consulta; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.estado_consulta (estado_consulta_id, estado_id, fecha, observaciones) FROM stdin;
\.


--
-- Data for Name: estado_tipo; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.estado_tipo (estado_id, nombre_estado) FROM stdin;
\.


--
-- Data for Name: fisioterapeuta; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fisioterapeuta (fisio_id, usuario_id, especialidad_id, horario_inicio, horario_fin, dias_atencion) FROM stdin;
\.


--
-- Data for Name: horario_fisioterapeuta; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.horario_fisioterapeuta (horario_id, fisio_id, fecha, hora_inicio, hora_fin, disponible) FROM stdin;
\.


--
-- Data for Name: paciente; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.paciente (paciente_id, usuario_id, edad, fecha_registro, ultima_interaccion) FROM stdin;
\.


--
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.usuario (usuario_id, nombre, apellidos, email, telefono, rol, "contrase¤a", fecha_registro) FROM stdin;
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.usuarios (id, name, email, password, phone, role, cedula) FROM stdin;
3d021e63-c163-4eb0-9089-0c958cc33d62	Juan Perez	JuanPerez@gmail.com	$2a$10$8AqlXvExGnDTq54bcZn96O2auscARjdI/KBkVXvHOTeGPpXb.5Wve	2222222662	paciente	\N
5031da33-69ed-43ee-bdeb-03bbfd18d61d	Eder Sanchez	ed@gmail.com	$2a$10$nKnyyd.gTRwLXcH7TiVSyOm0oirbT1da9KP77HTRDWMXXCijPTZae	1234567890	paciente	\N
614b84da-8f4d-4394-a78d-a54061bc3dc2	Adalid Montes Cirio	ada@gmail.com	$2a$10$wPvtqIeTSxo.xUKk66YvxuC.Qw2QN.wJLudF7MjOccjvc6B4SoZaG	2464595462	paciente	\N
f6f4075e-18e3-47a8-8b92-37165a7c41c9	Juan jimenez	juan@gmail.com	$2a$10$/.rJ6ZepY4Xo5DjXGbqpkuqF3sIYybIjdpSLHii01wsFf.DqfVZKu	1234567890	fisioterapeuta	1234esds2
70e6322b-180f-4e94-915e-8e8e50966f16	Gabriel	gabi@gmail.com	$2a$10$K6qmondaVG3Jm4PwIEeiVef5PP9RMBbjEPh.owNqW5WkmKA.jZK4.	1234567890	paciente	\N
\.


--
-- Name: chat_interaccion_mensaje_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.chat_interaccion_mensaje_id_seq', 1, false);


--
-- Name: ejercicio_ejercicio_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.ejercicio_ejercicio_id_seq', 1, false);


--
-- Name: especializacion_especialidad_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.especializacion_especialidad_id_seq', 1, false);


--
-- Name: estado_consulta_estado_consulta_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.estado_consulta_estado_consulta_id_seq', 1, false);


--
-- Name: estado_tipo_estado_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.estado_tipo_estado_id_seq', 1, false);


--
-- Name: fisioterapeuta_fisio_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.fisioterapeuta_fisio_id_seq', 1, false);


--
-- Name: horario_fisioterapeuta_horario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.horario_fisioterapeuta_horario_id_seq', 1, false);


--
-- Name: paciente_paciente_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.paciente_paciente_id_seq', 1, false);


--
-- Name: usuario_usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.usuario_usuario_id_seq', 1, false);


--
-- Name: users_sync users_sync_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.users_sync
    ADD CONSTRAINT users_sync_pkey PRIMARY KEY (id);


--
-- Name: Users Users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: chat_interaccion pk_chat_interaccion; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_interaccion
    ADD CONSTRAINT pk_chat_interaccion PRIMARY KEY (mensaje_id);


--
-- Name: ejercicio pk_ejercicio; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ejercicio
    ADD CONSTRAINT pk_ejercicio PRIMARY KEY (ejercicio_id);


--
-- Name: especializacion pk_especializacion; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.especializacion
    ADD CONSTRAINT pk_especializacion PRIMARY KEY (especialidad_id);


--
-- Name: estado_consulta pk_estado_consulta; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estado_consulta
    ADD CONSTRAINT pk_estado_consulta PRIMARY KEY (estado_consulta_id);


--
-- Name: estado_tipo pk_estado_tipo; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estado_tipo
    ADD CONSTRAINT pk_estado_tipo PRIMARY KEY (estado_id);


--
-- Name: fisioterapeuta pk_fisioterapeuta; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fisioterapeuta
    ADD CONSTRAINT pk_fisioterapeuta PRIMARY KEY (fisio_id);


--
-- Name: horario_fisioterapeuta pk_horario_fisioterapeuta; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.horario_fisioterapeuta
    ADD CONSTRAINT pk_horario_fisioterapeuta PRIMARY KEY (horario_id);


--
-- Name: paciente pk_paciente; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.paciente
    ADD CONSTRAINT pk_paciente PRIMARY KEY (paciente_id);


--
-- Name: usuario pk_usuario; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT pk_usuario PRIMARY KEY (usuario_id);


--
-- Name: usuario usuario_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key UNIQUE (email);


--
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: users_sync_deleted_at_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX users_sync_deleted_at_idx ON neon_auth.users_sync USING btree (deleted_at);


--
-- Name: chat_interaccion fk_chat_paciente; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_interaccion
    ADD CONSTRAINT fk_chat_paciente FOREIGN KEY (paciente_id) REFERENCES public.paciente(paciente_id) ON DELETE CASCADE;


--
-- Name: estado_consulta fk_estado_consulta_estado; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estado_consulta
    ADD CONSTRAINT fk_estado_consulta_estado FOREIGN KEY (estado_id) REFERENCES public.estado_tipo(estado_id) ON DELETE CASCADE;


--
-- Name: fisioterapeuta fk_fisio_especialidad; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fisioterapeuta
    ADD CONSTRAINT fk_fisio_especialidad FOREIGN KEY (especialidad_id) REFERENCES public.especializacion(especialidad_id) ON DELETE CASCADE;


--
-- Name: fisioterapeuta fk_fisio_usuario; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fisioterapeuta
    ADD CONSTRAINT fk_fisio_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuario(usuario_id) ON DELETE CASCADE;


--
-- Name: horario_fisioterapeuta fk_horario_fisio; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.horario_fisioterapeuta
    ADD CONSTRAINT fk_horario_fisio FOREIGN KEY (fisio_id) REFERENCES public.fisioterapeuta(fisio_id);


--
-- Name: paciente fk_paciente_usuario; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.paciente
    ADD CONSTRAINT fk_paciente_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuario(usuario_id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO fisioterapeuta;
GRANT USAGE ON SCHEMA public TO paciente;
GRANT USAGE ON SCHEMA public TO authenticated;


--
-- Name: SCHEMA pgrst; Type: ACL; Schema: -; Owner: -
--

GRANT USAGE ON SCHEMA pgrst TO authenticator;


--
-- Name: FUNCTION pre_config(); Type: ACL; Schema: pgrst; Owner: -
--

GRANT ALL ON FUNCTION pgrst.pre_config() TO authenticator;


--
-- Name: TABLE "Users"; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public."Users" TO authenticated;


--
-- Name: TABLE chat_interaccion; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.chat_interaccion TO authenticated;


--
-- Name: SEQUENCE chat_interaccion_mensaje_id_seq; Type: ACL; Schema: public; Owner: -
--

GRANT USAGE ON SEQUENCE public.chat_interaccion_mensaje_id_seq TO authenticated;


--
-- Name: TABLE ejercicio; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.ejercicio TO authenticated;


--
-- Name: SEQUENCE ejercicio_ejercicio_id_seq; Type: ACL; Schema: public; Owner: -
--

GRANT USAGE ON SEQUENCE public.ejercicio_ejercicio_id_seq TO authenticated;


--
-- Name: TABLE especializacion; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.especializacion TO authenticated;


--
-- Name: SEQUENCE especializacion_especialidad_id_seq; Type: ACL; Schema: public; Owner: -
--

GRANT USAGE ON SEQUENCE public.especializacion_especialidad_id_seq TO authenticated;


--
-- Name: TABLE estado_consulta; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.estado_consulta TO authenticated;


--
-- Name: SEQUENCE estado_consulta_estado_consulta_id_seq; Type: ACL; Schema: public; Owner: -
--

GRANT USAGE ON SEQUENCE public.estado_consulta_estado_consulta_id_seq TO authenticated;


--
-- Name: TABLE estado_tipo; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.estado_tipo TO authenticated;


--
-- Name: SEQUENCE estado_tipo_estado_id_seq; Type: ACL; Schema: public; Owner: -
--

GRANT USAGE ON SEQUENCE public.estado_tipo_estado_id_seq TO authenticated;


--
-- Name: TABLE fisioterapeuta; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.fisioterapeuta TO authenticated;


--
-- Name: SEQUENCE fisioterapeuta_fisio_id_seq; Type: ACL; Schema: public; Owner: -
--

GRANT USAGE ON SEQUENCE public.fisioterapeuta_fisio_id_seq TO authenticated;


--
-- Name: TABLE horario_fisioterapeuta; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.horario_fisioterapeuta TO authenticated;


--
-- Name: SEQUENCE horario_fisioterapeuta_horario_id_seq; Type: ACL; Schema: public; Owner: -
--

GRANT USAGE ON SEQUENCE public.horario_fisioterapeuta_horario_id_seq TO authenticated;


--
-- Name: TABLE paciente; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.paciente TO authenticated;


--
-- Name: SEQUENCE paciente_paciente_id_seq; Type: ACL; Schema: public; Owner: -
--

GRANT USAGE ON SEQUENCE public.paciente_paciente_id_seq TO authenticated;


--
-- Name: TABLE usuario; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.usuario TO authenticated;


--
-- Name: SEQUENCE usuario_usuario_id_seq; Type: ACL; Schema: public; Owner: -
--

GRANT USAGE ON SEQUENCE public.usuario_usuario_id_seq TO authenticated;


--
-- Name: TABLE usuarios; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.usuarios TO authenticated;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE neondb_owner IN SCHEMA public GRANT USAGE ON SEQUENCES TO authenticated;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE neondb_owner IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE neondb_owner IN SCHEMA public GRANT SELECT,INSERT,DELETE,UPDATE ON TABLES TO authenticated;


--
-- PostgreSQL database dump complete
--

\unrestrict r4KTdQDa7l9vfsg6FPUtJ3EYtZAdLAFDeqIHClvRbacMzgkrAN5OHTIuxmY5dgZ

