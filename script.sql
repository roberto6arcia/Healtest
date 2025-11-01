
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    lastname VARCHAR(50),
    telephone VARCHAR(50),
    username VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(100),
    role VARCHAR(15),
    created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP,
    user_id INT REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS group_patient (
    id SERIAL PRIMARY KEY,
    group_id INT REFERENCES groups(id) ON DELETE CASCADE,
    paciente_id INT REFERENCES users(id) ON DELETE CASCADE
);
 
CREATE TABLE IF NOT EXISTS resourses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    type VARCHAR(50),
    realtype VARCHAR(255),
    description TEXT,
    data BYTEA,
    created_at TIMESTAMP,
    user_id INT REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    keyword VARCHAR(255),
    question TEXT,
    image BYTEA,
    realtype VARCHAR(255),
    created_at TIMESTAMP,
    user_id INT REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS options (
    id SERIAL PRIMARY KEY,
    option TEXT,
    question_id INT REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    dateInit TIMESTAMP,
    dateEnd TIMESTAMP,
    user_id INT REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS group_test (
    id SERIAL PRIMARY KEY,
    group_id INT REFERENCES groups(id) ON DELETE CASCADE,
    test_id INT REFERENCES tests(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS question_test (
    id SERIAL PRIMARY KEY,
    question_id INT REFERENCES questions(id) ON DELETE CASCADE,
    test_id INT REFERENCES tests(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS resourses_group (
    id SERIAL PRIMARY KEY,
    resourse_id INT REFERENCES resourses(id) ON DELETE CASCADE,
    group_id INT REFERENCES groups(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS test_response (
    id SERIAL PRIMARY KEY,
    question_id INT REFERENCES questions(id) ON DELETE CASCADE,
    test_id INT REFERENCES tests(id) ON DELETE CASCADE,
    option_id INT REFERENCES options(id) ON DELETE CASCADE,
    paciente_id INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS test_state (
    id SERIAL PRIMARY KEY,
    test_id INT REFERENCES tests(id) ON DELETE CASCADE,
    paciente_id INT REFERENCES users(id) ON DELETE CASCADE,
    state VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    type VARCHAR(10),
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS crucigram (
    id SERIAL PRIMARY KEY,
    question TEXT,
    answer VARCHAR(10),
    index INT,
    position VARCHAR(10),
    activity_id INT REFERENCES activities(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS task (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP,
    activity_id INT REFERENCES activities(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS activity_group (
    id SERIAL PRIMARY KEY,
    activity_id INT REFERENCES activities(id) ON DELETE CASCADE,
    group_id INT REFERENCES groups(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS activity_state (
    id SERIAL PRIMARY KEY,
    activity_id INT REFERENCES activities(id) ON DELETE CASCADE,
    paciente_id INT REFERENCES users(id) ON DELETE CASCADE,
    state VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS activity_response (
    id SERIAL PRIMARY KEY,
    question TEXT,
    answer VARCHAR(10),
    index INT,
    position VARCHAR(10),
    activity_id INT REFERENCES activities(id) ON DELETE CASCADE,
    paciente_id INT REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS task_response (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    type VARCHAR(50),
    realtype VARCHAR(255),
    description TEXT,
    data BYTEA,
    created_at TIMESTAMP,
    activity_id INT REFERENCES activities(id) ON DELETE CASCADE,
    paciente_id INT REFERENCES users(id) ON DELETE CASCADE
);

-- ALTER TABLE activities ADD COLUMN created_at TIMESTAMP;

CREATE FUNCTION tr_insert_state()
RETURNS TRIGGER
AS
$$
DECLARE 
    v_group_id INT;
    v_test_id INT;
    v_patient_id INT;
    v_t_id INT;
    v_p_id INT;
BEGIN 

    -- Obtener el group_id y test_id del registro insertado
    SELECT group_id, test_id 
    INTO v_group_id, v_test_id
    FROM group_test
    WHERE id = NEW.id;

    -- Verificar si se encontró un registro válido
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró el registro en group_test para id=%', NEW.id;
    END IF;

    -- Iterar sobre cada paciente_id relacionado con el group_id
    FOR v_patient_id IN 
        SELECT paciente_id 
        FROM group_patient
        WHERE group_id = v_group_id
    LOOP
        SELECT test_id, paciente_id 
        INTO v_t_id, v_p_id
        FROM test_state
        WHERE test_id = v_test_id AND paciente_id = v_patient_id;

        IF NOT FOUND THEN
            -- Insertar en test_state para cada paciente
            INSERT INTO test_state (test_id, paciente_id, state) 
            VALUES (v_test_id, v_patient_id, 'Pendiente');
        END IF;
        
    END LOOP;

    RETURN NEW;

END
$$
LANGUAGE plpgsql;

-- Crear el trigger asociado
CREATE TRIGGER setState
AFTER INSERT ON group_test
FOR EACH ROW
EXECUTE PROCEDURE tr_insert_state();


CREATE FUNCTION tr_delete_state()
RETURNS TRIGGER
AS
$$
DECLARE 
    v_group_id INT;
    v_test_id INT;
    v_patient_id INT;
    v_t_id INT;
    v_p_id INT;
BEGIN 

    -- Obtener el group_id y test_id del registro eliminado
    v_group_id = OLD.group_id;
    v_test_id = OLD.test_id;

    -- Iterar sobre cada paciente_id relacionado con el group_id
    FOR v_patient_id IN 
        SELECT paciente_id 
        FROM group_patient
        WHERE group_id = v_group_id
    LOOP
        SELECT test_id, paciente_id 
        INTO v_t_id, v_p_id
        FROM test_state
        WHERE test_id = v_test_id AND paciente_id = v_patient_id;

        IF FOUND THEN
            -- Eliminar en test_state para cada paciente
            DELETE 
            FROM test_state 
            WHERE test_id = v_test_id AND paciente_id = v_patient_id;
        END IF;
        
    END LOOP;

    RETURN OLD;

END
$$
LANGUAGE plpgsql;

-- Crear el trigger asociado
CREATE TRIGGER deleteState
AFTER DELETE ON group_test
FOR EACH ROW
EXECUTE PROCEDURE tr_delete_state();


CREATE FUNCTION tr_update_state()
RETURNS TRIGGER
AS
$$
DECLARE 
    v_test_id INT;
    v_patient_id INT;
    v_state VARCHAR(10) := 'Terminada';
BEGIN 

    -- Obtener el paciente_id y test_id del registro insertado
    SELECT paciente_id, test_id 
    INTO v_patient_id, v_test_id
    FROM test_response
    WHERE id = NEW.id;

    -- Verificar si se encontró un registro válido
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró el registro en test_response para id=%', NEW.id;
    END IF;

    UPDATE test_state SET state = v_state WHERE test_id = v_test_id AND paciente_id = v_patient_id;

    RETURN NEW;

END
$$
LANGUAGE plpgsql;

-- Crear el trigger asociado
CREATE TRIGGER updateState
AFTER INSERT ON test_response
FOR EACH ROW
EXECUTE PROCEDURE tr_update_state();


CREATE FUNCTION tr_insert_act_state()
RETURNS TRIGGER
AS
$$
DECLARE 
    v_group_id INT;
    v_activity_id INT;
    v_patient_id INT;
    v_a_id INT;
    v_p_id INT;
BEGIN 

    -- Obtener el group_id y activity_id del registro insertado
    SELECT group_id, activity_id 
    INTO v_group_id, v_activity_id
    FROM activity_group
    WHERE id = NEW.id;

    -- Verificar si se encontró un registro válido
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró el registro en activity_group para id=%', NEW.id;
    END IF;

    -- Iterar sobre cada paciente_id relacionado con el group_id
    FOR v_patient_id IN 
        SELECT paciente_id 
        FROM group_patient
        WHERE group_id = v_group_id
    LOOP
        SELECT activity_id, paciente_id 
        INTO v_a_id, v_p_id
        FROM activity_state
        WHERE activity_id = v_activity_id AND paciente_id = v_patient_id;

        IF NOT FOUND THEN
            -- Insertar en activity_state para cada paciente
            INSERT INTO activity_state (activity_id, paciente_id, state) 
            VALUES (v_activity_id, v_patient_id, 'Pendiente');
        END IF;
        
    END LOOP;

    RETURN NEW;

END
$$
LANGUAGE plpgsql;

-- Crear el trigger asociado
CREATE TRIGGER setStateActivity
AFTER INSERT ON activity_group
FOR EACH ROW
EXECUTE PROCEDURE tr_insert_act_state();


CREATE FUNCTION tr_delete_act_state()
RETURNS TRIGGER
AS
$$
DECLARE 
    v_group_id INT;
    v_activity_id INT;
    v_patient_id INT;
    v_a_id INT;
    v_p_id INT;
BEGIN 

    -- Obtener el group_id y activity_id del registro eliminado
    v_group_id = OLD.group_id;
    v_activity_id = OLD.activity_id;

    -- Iterar sobre cada paciente_id relacionado con el group_id
    FOR v_patient_id IN 
        SELECT paciente_id 
        FROM group_patient
        WHERE group_id = v_group_id
    LOOP
        SELECT activity_id, paciente_id 
        INTO v_a_id, v_p_id
        FROM activity_state
        WHERE activity_id = v_activity_id AND paciente_id = v_patient_id;

        IF FOUND THEN
            -- Eliminar en activity_state para cada paciente
            DELETE 
            FROM activity_state 
            WHERE activity_id = v_activity_id AND paciente_id = v_patient_id;
        END IF;
        
    END LOOP;

    RETURN OLD;

END
$$
LANGUAGE plpgsql;

-- Crear el trigger asociado
CREATE TRIGGER deleteStateActivity
AFTER DELETE ON activity_group
FOR EACH ROW
EXECUTE PROCEDURE tr_delete_act_state();


CREATE FUNCTION tr_update_act_state()
RETURNS TRIGGER
AS
$$
DECLARE 
    v_activity_id INT;
    v_patient_id INT;
    v_state VARCHAR(10) := 'Terminada';
BEGIN 

    -- Obtener el paciente_id y activity_id del registro insertado
    SELECT paciente_id, activity_id 
    INTO v_patient_id, v_activity_id
    FROM activity_response
    WHERE id = NEW.id;

    -- Verificar si se encontró un registro válido
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró el registro en activity_response para id=%', NEW.id;
    END IF;

    UPDATE activity_state SET state = v_state WHERE activity_id = v_activity_id AND paciente_id = v_patient_id;

    RETURN NEW;

END
$$
LANGUAGE plpgsql;

-- Crear el trigger asociado
CREATE TRIGGER updateStateActivity
AFTER INSERT ON activity_response
FOR EACH ROW
EXECUTE PROCEDURE tr_update_act_state();


CREATE FUNCTION tr_update_act_task_state()
RETURNS TRIGGER
AS
$$
DECLARE 
    v_activity_id INT;
    v_patient_id INT;
    v_state VARCHAR(10) := 'Terminada';
BEGIN 

    -- Obtener el paciente_id y activity_id del registro insertado
    SELECT paciente_id, activity_id 
    INTO v_patient_id, v_activity_id
    FROM task_response
    WHERE id = NEW.id;

    -- Verificar si se encontró un registro válido
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró el registro en task_response para id=%', NEW.id;
    END IF;

    UPDATE activity_state SET state = v_state WHERE activity_id = v_activity_id AND paciente_id = v_patient_id;

    RETURN NEW;

END
$$
LANGUAGE plpgsql;

-- Crear el trigger asociado
CREATE TRIGGER updateStateActivityTask
AFTER INSERT ON task_response
FOR EACH ROW
EXECUTE PROCEDURE tr_update_act_task_state();


CREATE FUNCTION tr_insert_state_by_new_patient()
RETURNS TRIGGER
AS
$$
DECLARE 
    v_group_id INT;
    v_test_id INT;
    v_patient_id INT;
    v_t_id INT;
    v_p_id INT;
BEGIN 

    -- Obtener el group_id y test_id del registro insertado
    SELECT group_id, paciente_id 
    INTO v_group_id, v_patient_id
    FROM group_patient
    WHERE id = NEW.id;

    -- Verificar si se encontró un registro válido
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró el registro en group_patient para id=%', NEW.id;
    END IF;

    -- Iterar sobre cada paciente_id relacionado con el group_id
    FOR v_test_id IN 
        SELECT test_id 
        FROM group_test
        WHERE group_id = v_group_id
    LOOP
        SELECT test_id, paciente_id 
        INTO v_t_id, v_p_id
        FROM test_state
        WHERE test_id = v_test_id AND paciente_id = v_patient_id;

        IF NOT FOUND THEN
            -- Insertar en test_state para cada paciente
            INSERT INTO test_state (test_id, paciente_id, state) 
            VALUES (v_test_id, v_patient_id, 'Pendiente');
        END IF;
        
    END LOOP;

    RETURN NEW;

END
$$
LANGUAGE plpgsql;

-- Crear el trigger asociado
CREATE TRIGGER setStateByNewPatient
AFTER INSERT ON group_patient
FOR EACH ROW
EXECUTE PROCEDURE tr_insert_state_by_new_patient();


CREATE FUNCTION tr_insert_state_by_group_patient()
RETURNS TRIGGER
AS
$$
DECLARE 
    v_group_id INT;
    v_test_id INT;
    v_patient_id INT;
    v_t_id INT;
    v_p_id INT;
BEGIN 

    -- Obtener el viejo group_id y paciente_id del registro modificado
    v_patient_id = OLD.paciente_id;
    v_group_id = NEW.group_id;

    -- Iterar sobre cada paciente_id relacionado con el group_id
    FOR v_test_id IN 
        SELECT test_id 
        FROM group_test
        WHERE group_id = v_group_id
    LOOP
        SELECT test_id, paciente_id 
        INTO v_t_id, v_p_id
        FROM test_state
        WHERE test_id = v_test_id AND paciente_id = v_patient_id;

        IF NOT FOUND THEN
            -- Insertar en test_state para cada paciente
            INSERT INTO test_state (test_id, paciente_id, state) 
            VALUES (v_test_id, v_patient_id, 'Pendiente');
        END IF;
        
    END LOOP;


    RETURN OLD;

END
$$
LANGUAGE plpgsql;

-- Crear el trigger asociado
CREATE TRIGGER insertStateByGroupPatient
AFTER UPDATE ON group_patient
FOR EACH ROW
EXECUTE PROCEDURE tr_insert_state_by_group_patient();


CREATE FUNCTION tr_delete_state_by_group_patient()
RETURNS TRIGGER
AS
$$
DECLARE 
    v_group_id INT;
    v_test_id INT;
    v_patient_id INT;
    v_t_id INT;
    v_p_id INT;
BEGIN 

    -- Obtener el viejo group_id y paciente_id del registro modificado
    v_group_id = OLD.group_id;
    v_patient_id = OLD.paciente_id;

    -- Iterar sobre cada test_id relacionado con el group_id
    FOR v_test_id IN 
        SELECT test_id 
        FROM group_test
        WHERE group_id = v_group_id
    LOOP
        SELECT test_id, paciente_id 
        INTO v_t_id, v_p_id
        FROM test_state
        WHERE test_id = v_test_id AND paciente_id = v_patient_id;

        IF FOUND THEN
            -- Eliminar en test_state para cada paciente
            DELETE 
            FROM test_state 
            WHERE test_id = v_test_id AND paciente_id = v_patient_id;
        END IF;
        
    END LOOP;

    RETURN OLD;

END
$$
LANGUAGE plpgsql;

-- Crear el trigger asociado
CREATE TRIGGER deleteStateByGroupPatient
AFTER UPDATE ON group_patient
FOR EACH ROW
EXECUTE PROCEDURE tr_delete_state_by_group_patient();


CREATE FUNCTION tr_insert_act_state_by_new_patient()
RETURNS TRIGGER
AS
$$
DECLARE 
    v_group_id INT;
    v_activity_id INT;
    v_patient_id INT;
    v_a_id INT;
    v_p_id INT;
BEGIN 

    -- Obtener el group_id y activity_id del registro insertado
    SELECT group_id, paciente_id 
    INTO v_group_id, v_patient_id
    FROM group_patient
    WHERE id = NEW.id;

    -- Verificar si se encontró un registro válido
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró el registro en group_patient para id=%', NEW.id;
    END IF;

    -- Iterar sobre cada paciente_id relacionado con el group_id
    FOR v_activity_id IN 
        SELECT activity_id 
        FROM activity_group
        WHERE group_id = v_group_id
    LOOP
        SELECT activity_id, paciente_id 
        INTO v_a_id, v_p_id
        FROM activity_state
        WHERE activity_id = v_activity_id AND paciente_id = v_patient_id;

        IF NOT FOUND THEN
            -- Insertar en activity_state para cada paciente
            INSERT INTO activity_state (activity_id, paciente_id, state) 
            VALUES (v_activity_id, v_patient_id, 'Pendiente');
        END IF;
        
    END LOOP;

    RETURN NEW;

END
$$
LANGUAGE plpgsql;

-- Crear el trigger asociado
CREATE TRIGGER setStateActivityByNewPatient
AFTER INSERT ON group_patient
FOR EACH ROW
EXECUTE PROCEDURE tr_insert_act_state_by_new_patient();


CREATE FUNCTION tr_delete_act_state_by_group_patient()
RETURNS TRIGGER
AS
$$
DECLARE 
    v_group_id INT;
    v_activity_id INT;
    v_patient_id INT;
    v_a_id INT;
    v_p_id INT;
BEGIN 

    -- Obtener el viejo group_id y paciente_id del registro modificado
    v_group_id = OLD.group_id;
    v_patient_id = OLD.paciente_id;

    -- Iterar sobre cada test_id relacionado con el group_id
    FOR v_activity_id IN 
        SELECT activity_id 
        FROM activity_group
        WHERE group_id = v_group_id
    LOOP
        SELECT activity_id, paciente_id 
        INTO v_a_id, v_p_id
        FROM activity_state
        WHERE activity_id = v_activity_id AND paciente_id = v_patient_id;

        IF FOUND THEN
            -- Eliminar en test_state para cada paciente
            DELETE 
            FROM activity_state 
            WHERE activity_id = v_activity_id AND paciente_id = v_patient_id;
        END IF;
        
    END LOOP;

    RETURN OLD;

END
$$
LANGUAGE plpgsql;

-- Crear el trigger asociado
CREATE TRIGGER deleteStateActivityByGroupPatient
AFTER UPDATE ON group_patient
FOR EACH ROW
EXECUTE PROCEDURE tr_delete_act_state_by_group_patient();


CREATE FUNCTION tr_insert_act_state_by_group_patient()
RETURNS TRIGGER
AS
$$
DECLARE 
    v_group_id INT;
    v_activity_id INT;
    v_patient_id INT;
    v_a_id INT;
    v_p_id INT;
BEGIN 

    -- Obtener el viejo group_id y paciente_id del registro modificado
    v_group_id = NEW.group_id;
    v_patient_id = OLD.paciente_id;

    -- Iterar sobre cada test_id relacionado con el group_id
    FOR v_activity_id IN 
        SELECT activity_id 
        FROM activity_group
        WHERE group_id = v_group_id
    LOOP
        SELECT activity_id, paciente_id 
        INTO v_a_id, v_p_id
        FROM activity_state
        WHERE activity_id = v_activity_id AND paciente_id = v_patient_id;

        IF NOT FOUND THEN
            -- Insertar en activity_state para cada paciente
            INSERT INTO activity_state (activity_id, paciente_id, state) 
            VALUES (v_activity_id, v_patient_id, 'Pendiente');
        END IF;

    END LOOP;

    RETURN OLD;

END
$$
LANGUAGE plpgsql;

-- Crear el trigger asociado
CREATE TRIGGER insertStateActivityByGroupPatient
AFTER UPDATE ON group_patient
FOR EACH ROW
EXECUTE PROCEDURE tr_insert_act_state_by_group_patient();


INSERT INTO users (name, lastname, telephone, username, email, password, role, created_at)  
VALUES (
    'Administrador',
    'Admin',
    '33344445555',
    'cardim',
    'administrador@gmail.com',
    '$2a$10$RXpRh7RbyjKln7xwl.EhhuusNkQDZQJQVqa8diz2LMboBAg5a3Yfq',
    'admin',
    current_timestamp
);

