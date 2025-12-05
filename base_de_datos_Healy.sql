CREATE TABLE usuario (
    usuario_id      SERIAL,
    nombre          VARCHAR(60)    NOT NULL,
    apellidos       VARCHAR(60)    NOT NULL,
    email           VARCHAR(100)   NOT NULL UNIQUE,
    telefono        VARCHAR(15),
    rol             VARCHAR(20)    NOT NULL,
    contraseña      VARCHAR(200)   NOT NULL,
    fecha_registro  DATE           NOT NULL DEFAULT CURRENT_DATE,

    CONSTRAINT pk_usuario PRIMARY KEY (usuario_id)
);


CREATE TABLE estado_tipo (
    estado_id       SERIAL,
    nombre_estado   VARCHAR(30) NOT NULL,

    CONSTRAINT pk_estado_tipo PRIMARY KEY (estado_id)
);


--   TABLA: PACIENTE
CREATE TABLE paciente (
    paciente_id      SERIAL,
    usuario_id       INT            NOT NULL,
    edad             INT            NOT NULL,
    fecha_registro   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultima_interaccion TIMESTAMP,

    CONSTRAINT pk_paciente PRIMARY KEY (paciente_id),

    CONSTRAINT fk_paciente_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuario(usuario_id)
        ON DELETE CASCADE
);

CREATE TABLE especializacion (
    especialidad_id      SERIAL,
    nombre_especialidad  VARCHAR(50) NOT NULL,
    descripcion          VARCHAR(50),

    CONSTRAINT pk_especializacion PRIMARY KEY (especialidad_id)
);

--   TABLA: FISIOTERAPEUTA
CREATE TABLE fisioterapeuta (
    fisio_id         SERIAL,
    usuario_id       INT          NOT NULL,
    especialidad_id  INT          NOT NULL,
    horario_inicio   TIME         NOT NULL,
    horario_fin      TIME         NOT NULL,
    dias_atencion    VARCHAR(50)  NOT NULL,

    CONSTRAINT pk_fisioterapeuta PRIMARY KEY (fisio_id),

    CONSTRAINT fk_fisio_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuario(usuario_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_fisio_especialidad FOREIGN KEY (especialidad_id)
        REFERENCES especializacion(especialidad_id)
        ON DELETE CASCADE
);

--   TABLA: CHAT_INTERACCION
CREATE TABLE chat_interaccion (
    mensaje_id        SERIAL,
    paciente_id       INT          NOT NULL,
    emisor            VARCHAR(50)  NOT NULL,    
    mensaje           TEXT         NOT NULL,
    fecha_hora        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    etapa_conversacion VARCHAR(50) NOT NULL,

    CONSTRAINT pk_chat_interaccion PRIMARY KEY (mensaje_id),

    CONSTRAINT fk_chat_paciente
        FOREIGN KEY (paciente_id)
        REFERENCES paciente(paciente_id)
        ON DELETE CASCADE
);

CREATE TABLE ejercicio (
    ejercicio_id   SERIAL,
    descripcion    VARCHAR(300),
    nombre         VARCHAR(100),

    CONSTRAINT pk_ejercicio PRIMARY KEY (ejercicio_id)
);


CREATE TABLE estado_consulta (
    estado_consulta_id  SERIAL,
    estado_id           INT NOT NULL,
    fecha               TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    observaciones       TEXT,

    CONSTRAINT pk_estado_consulta PRIMARY KEY (estado_consulta_id),

    CONSTRAINT fk_estado_consulta_estado
        FOREIGN KEY (estado_id)
        REFERENCES estado_tipo(estado_id)
        ON DELETE CASCADE
);



CREATE TABLE horario_fisioterapeuta (
    horario_id     SERIAL,
    fisio_id       INT NOT NULL,
    fecha          DATE NOT NULL,
    hora_inicio    TIME NOT NULL,
    hora_fin       TIME NOT NULL,
    disponible     BOOLEAN DEFAULT TRUE,

    CONSTRAINT pk_horario_fisioterapeuta PRIMARY KEY (horario_id),

    CONSTRAINT fk_horario_fisio
        FOREIGN KEY (fisio_id)
        REFERENCES fisioterapeuta(fisio_id)
);

CREATE TABLE cita (
    cita_id             SERIAL,
    paciente_id         INT          NOT NULL,
    fisio_id            INT          NOT NULL,
    fecha_cita          DATE         NOT NULL,
    hora_cita           TIME         NOT NULL,
    estado              INT NOT NULL,
    motivo              VARCHAR(150) NOT NULL,
    confirmacion_usuario BOOLEAN      DEFAULT FALSE,
    zona_afectada       VARCHAR(100),
    lesion              VARCHAR(300),
    fecha_lesion        TIMESTAMP,
    rating_dolor        INT,
    fac_emp             VARCHAR(300),
    fac_mej             VARCHAR(300),
    act_paciente        VARCHAR(250),
    asi_ejercicios      INT,
    notas               VARCHAR(300),

    CONSTRAINT pk_cita PRIMARY KEY (cita_id),

    CONSTRAINT fk_cita_paciente
        FOREIGN KEY (paciente_id)
        REFERENCES paciente(paciente_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_cita_fisio
        FOREIGN KEY (fisio_id)
        REFERENCES fisioterapeuta(fisio_id)
        ON DELETE SET NULL,

    CONSTRAINT fk_cita_ejecicio
        FOREIGN KEY (asi_ejercicios)
        REFERENCES ejercicio(ejercicio_id),
        
    CONSTRAINT fk_cita_estado
        FOREIGN KEY (estado)
        REFERENCES estado_consulta(estado_consulta_id)
        );

CREATE TABLE consulta (
    consulta_id     SERIAL,
    cita_id         INT NOT NULL,
    paciente_id     INT NOT NULL,
    fisio_id        INT NOT NULL,
    motivo          TEXT NOT NULL,
    diagnostico     TEXT,
    estado          INT NOT NULL,

    CONSTRAINT pk_consulta PRIMARY KEY (consulta_id),

    CONSTRAINT fk_consulta_cita
        FOREIGN KEY (cita_id)
        REFERENCES cita(cita_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_consulta_paciente
        FOREIGN KEY (paciente_id)
        REFERENCES paciente(paciente_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_consulta_fisio
        FOREIGN KEY (fisio_id)
        REFERENCES fisioterapeuta(fisio_id)
        ON DELETE SET NULL,

    CONSTRAINT fk_consulta_estado
        FOREIGN KEY (estado)
        REFERENCES estado_tipo(estado_id)
);

CREATE TABLE historial_ejercicio (
    historial_ejercicio_id SERIAL PRIMARY KEY,

    ejercicio_id INT NOT NULL,
    consulta_id  INT NOT NULL,
    paciente_id  INT NOT NULL,
    fisio_id     INT NOT NULL,

    fecha_asignacion TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_historial_ejercicio_ejercicio
        FOREIGN KEY (ejercicio_id)
        REFERENCES ejercicio (ejercicio_id),

    CONSTRAINT fk_historial_ejercicio_consulta
        FOREIGN KEY (consulta_id)
        REFERENCES consulta (consulta_id),

    CONSTRAINT fk_historial_ejercicio_paciente
        FOREIGN KEY (paciente_id)
        REFERENCES paciente (paciente_id),
        

    CONSTRAINT fk_historial_ejercicio_fisio
        FOREIGN KEY (fisio_id)
        REFERENCES fisioterapeuta (fisio_id)
        );

ALTER TABLE cita
ADD COLUMN calendar_event_id VARCHAR(255),
ADD COLUMN calendar_html_link TEXT,
ADD COLUMN booking_token UUID DEFAULT gen_random_uuid(),
ADD COLUMN reminder_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN reminder_sent_at TIMESTAMP;

ALTER TABLE usuario
ADD COLUMN verificacion_codigo VARCHAR(6),
ADD COLUMN verificacion_expira TIMESTAMP,
ADD COLUMN whatsapp_nombre VARCHAR(100),
ADD COLUMN origen VARCHAR(20) DEFAULT 'web'; -- valores: 'web', 'whatsapp' (esta es opcional ajkdhkja)