import { query } from 'express';
import pool from '../config/db.js'

async function getUserName(username) {
    try {
        const [rows] = await pool.execute('SELECT * FROM USERS WHERE username_user = ?;', [username]);
        return rows;
    } catch (error) {
        throw new Error('Error al obtener información: ' + error);
    }
};

async function getPacienteEmail(emailpaciente) {
    try {
        const [rows] = await pool.execute('SELECT * FROM PACIENTES WHERE email_pac = ?;', [emailpaciente]);
        return rows;
    } catch (error) {
        throw new Error('Error al obtener información: ' + error);
    }
};

async function getDoctorEmail(emaildoctor) {
    try {
        const [rows] = await pool.execute('SELECT * FROM DOCTORES WHERE email_doc = ?;', [emaildoctor]);
        return rows;
    } catch (error) {
        throw new Error('Error al obtener información: ' + error);
    }
};

async function getSecretarioEmail(email) {
    try {
        const [rows] = await pool.execute('SELECT * FROM SECRETARIOS WHERE email_sec = ?;', [email]);
        return rows;
    } catch (error) {
        throw new Error('Error al obtener información: ' + error);
    }
};

async function getIdUserPac(cedula) {
    try {
        const [rows] = await pool.execute('SELECT id_user FROM PACIENTES WHERE cedula_pac = ?;', [cedula]);
        return rows;
    } catch (error) {
        throw new Error('Error al obtener información: ' + error);
    }
};

async function getFechaRegistro(fechaRegistro) {
    try {
        const [rows] = await pool.execute('SELECT * FROM CITA WHERE fecha_realizar_cita = ?;', [fechaRegistro]);
        return rows;
    } catch (error) {
        throw new Error('Error al obtener información: ' + error);
    }
};

async function getPacienteCedulaId(cedula) {
    try {
        const [rows] = await pool.execute('SELECT * FROM PACIENTES WHERE cedula_pac = ?;', [cedula]);
        return rows;
    } catch (error) {
        throw new Error('Error al obtener información: ' + error);
    }
};

async function getPacienteCedula(cedula) {
    try {
        const [rows] = await pool.execute('SELECT id_pac FROM PACIENTES WHERE cedula_pac = ?;', [cedula]);
        return rows[0];
    } catch (error) {
        console.error('Error while retrieving patient by cedula:', error);
        throw new Error('Error al obtener información: ' + error);
    }
};

async function getDoctorCedula(cedula) {
    try {
        const [rows] = await pool.execute('SELECT * FROM DOCTORES WHERE cedula_doc = ?;', [cedula]);
        return rows;
    } catch (error) {
        throw new Error('Error al obtener información: ' + error);
    }
};

async function getSecretarioCedula(cedula) {
    try {
        const [rows] = await pool.execute('SELECT * FROM SECRETARIOS WHERE cedula_sec = ?;', [cedula]);
        return rows;
    } catch (error) {
        throw new Error('Error al obtener información: ' + error);
    }
};

async function getInfo(table, id_user) {
    try {
        const [rows] = await pool.query(`SELECT * FROM ${table.toUpperCase()} WHERE id_user = ?;`, [id_user]);
        return rows[0];
    } catch (error) {
        throw new Error('Error al obtener información: ' + error);
    }
};

async function getInfoByCedula(table, cedula) {
    try {
        const [rows] = await pool.query(`SELECT * FROM ${table.toUpperCase()} WHERE cedula_pac = ?;`, [cedula]);
        return rows[0];
    } catch (error) {
        throw new Error('Error al obtener información: ' + error);
    }
};

async function getCitasDoc(id_doc) {
    try {
        const [rows] = await pool.query('SELECT * FROM CITA WHERE id_doc = ?;', [id_doc]);
        return rows;
    } catch (error) {
        throw new Error('Error al obtener información: ' + error);
    }
};
//--
async function getCitasPac(id_pac) {
    try {
        const [rows] = await pool.query('SELECT * FROM CITA WHERE id_pac = ?;', [id_pac]);
        return rows;
    } catch (error) {
        throw new Error('Error al obtener información: ' + error);
    }
};

async function getCitaId(id_cita) {
    try {
        const [rows] = await pool.query('SELECT * FROM CITA WHERE id_cita = ?;', [id_cita]);
        return rows[0];
    } catch (error) {
        throw new Error('Error al obtener información: ' + error);
    }
};

async function getCitaForIdOfPac(id_pac){
    try{
        const[rows] = await pool.query('SELECT * FROM CITA c, DOCTORES d WHERE c.id_doc = d.id_doc and c.id_pac = ?;', [id_pac]);
        return rows;
    } catch(error){
        throw new Error('Error al obtener información: ' + error);
    }

}

async function getCitaForIdOfDoc(id_doc){
    try{
        const[rows] = await pool.query('SELECT * FROM CITA WHERE id_doc = ?;', [id_doc]);
        return rows;
    } catch(error){
        throw new Error('Error al obtener información: ' + error);
    }
}

async function getDependantForIdOfPac(id_pac){
    try{
        const[rows] = await pool.query('SELECT * FROM DEPENDIENTES WHERE id_pac= ?;', [id_pac])
        return rows;
    } catch(error){
        throw new Error('Error al obtener información: ' + error);
    }

}

async function getCitaDayRangeRegistro(date_from, date_to) {
    // Formato esperado para fechas: YYYY-MM-DD
    try {
        const [rows] = await pool.query('SELECT * FROM CITA WHERE fecha_registro_cita >= ? AND fecha_registro_cita <= ?;', [date_from, date_to]);
        return rows;
    } catch (error) {
        throw new Error('Error al obtener información: ' + error);
    }
};

async function getCitaDayRangeRealizado(date_from, date_to) {
    // Formato esperado para fechas: YYYY-MM-DD
    try {
        const [rows] = await pool.query('SELECT * FROM CITA WHERE fecha_realizar_cita >= ? AND fecha_realizar_cita <= ?;', [date_from, date_to]);
        return rows;
    } catch (error) {
        throw new Error('Error al obtener información: ' + error);
    }
};

async function getRoles() {
    try {
        const [rows] = await pool.query('SELECT * FROM ROLES WHERE 1;');

        console.log(rows);
        return rows;
    } catch (error) {
        throw new Error('Error al obtener información: ' + error);
    }
};

// Only add Pacientes, no Doctors
// Doctors created by admin in MySQL, not in functions
async function addUser(username, password) {
    try {
        // Paciente: id_rol = 3
        const [result] = await pool.query('INSERT INTO USERS (username_user, password_user, id_rol) VALUES (?, ?, 3);', [username, password]);

        return result.insertId;
    } catch (error) {
        throw new Error('Error al obtener información: ' + error);
    }
}

async function addUserDoctor(username, password) {
    try {
        const [result] = await pool.query('INSERT INTO USERS (username_user, password_user, id_rol) VALUES (?, ?, 2);', [username, password]);

        return result.insertId;
    } catch (error) {
        throw new Error('Error al obtener información: ' + error);
    }
}

async function addUserSecretario(username, password) {
    try {
        const [result] = await pool.query('INSERT INTO USERS (username_user, password_user, id_rol) VALUES (?, ?, 4);', [username, password]);

        return result.insertId;
    } catch (error) {
        throw new Error('Error al obtener información: ' + error);
    }
}

async function addPacienteInfo(Names, SurNames, cedula, fecha_nac, email, id_user) {
    try {
        const [result] = await pool.query(
            'INSERT INTO PACIENTES (nombres_pac, apellidos_pac, cedula_pac, fecha_nac_pac, email_pac, id_user) VALUES (?, ?, ?, ?, ?, ?)', 
            [Names, SurNames, cedula, fecha_nac, email, id_user]
        );
        return result;
    } catch (error) {
        throw new Error('Error al registrar paciente: ' + error);
    }
};

async function addDoctorInfo(Names, SurNames, cedula, email, id_user) {
    try {
        const [result] = await pool.query(
            'INSERT INTO DOCTORES (nombres_doc, apellidos_doc, cedula_doc, email_doc, id_user) VALUES (?, ?, ?, ?, ?)', 
            [Names, SurNames, cedula, email, id_user]
        );
        return result;
    } catch (error) {
        throw new Error('Error al registrar paciente: ' + error);
    }
};

async function addSecretarioInfo(Names, SurNames, cedula, email, id_user) {
    try {
        const [result] = await pool.query(
            'INSERT INTO SECRETARIOS (nombres_sec, apellidos_sec, cedula_sec, email_sec, id_user) VALUES (?, ?, ?, ?, ?)', 
            [Names, SurNames, cedula, email, id_user]
        );
        return result;
    } catch (error) {
        throw new Error('Error al registrar paciente: ' + error);
    }
};

async function addCita(nombre_paciente_cita, apellido_paciente_cita, cedula_paciente_cita, asunto_cita, fecha_registro_cita, fecha_realizar_cita, hora_cita, valor_cita, comentario_doc_cita, comentario_pac_cita,estado_cita, id_doc, id_pac) {
    try {
        console.log("Entro add cita");
        
        const [result] = await pool.query(
            'INSERT INTO CITA (nombre_paciente_cita, apellido_paciente_cita, cedula_paciente_cita, asunto_cita, fecha_registro_cita, fecha_realizar_cita, hora_cita, valor_cita, comentario_doc_cita, comentario_pac_cita, estado_cita, id_doc, id_pac) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [nombre_paciente_cita, apellido_paciente_cita, cedula_paciente_cita, asunto_cita, fecha_registro_cita, fecha_realizar_cita, hora_cita, valor_cita, comentario_doc_cita, comentario_pac_cita, estado_cita, id_doc, id_pac]
        );

        return result;
    } catch (error) {
        throw new Error('Error al registrar la cita: ' + error);
    }
};

async function addDependent(cedula, nombre, apellido, fechaNac, id_pac) {
    try {
        const [result] = await pool.query(
            'INSERT INTO DEPENDIENTES (cedula_dep, nombre_dep, apellido_dep, fecha_nac_dep, id_pac) VALUES (?, ?, ?, ?, ?);', 
            [cedula, nombre, apellido, fechaNac, id_pac]
        );
        return result;
    } catch (error) {
        throw new Error('Error al registrar dependiente: ' + error);
    }
};

async function getDependentsByPac(id_pac) {
    try {
        const [result] = await pool.query(
            'SELECT * FROM DEPENDIENTES WHERE id_pac = ?', 
            [id_pac]
        );
        return result;
    } catch (error) {
        throw new Error('Error al obtener información: ' + error);
    }
};

async function getDependentsByCedula(cedula) {
    try {
        const [result] = await pool.query(
            'SELECT * FROM DEPENDIENTES WHERE cedula_dep = ?', 
            [cedula]
        );
        return result;
    } catch (error) {
        throw new Error('Error al obtener información: ' + error);
    }
};

async function getIdOfUser(username) {
    try {
        const [rows] = await pool.query('SELECT id_user FROM USERS WHERE username_user = ?;', [username]);
        return rows.length > 0 ? rows[0].id_user : null;
    } catch (error) {
        throw new Error('Error al obtener el ID del usuario: ' + error);
    }
}

async function getId(id_user) {
    try {
        let [rows] = await pool.query('SELECT id_pac FROM PACIENTES WHERE id_user = ?;', [id_user]);
        if (rows.length > 0) {
            return rows[0].id_pac;
        }
        [rows] = await pool.query('SELECT id_doc FROM DOCTORES WHERE id_user = ?;', [id_user]);
        if (rows.length > 0) {
            return rows[0].id_doc;
        }
        return null;
    } catch (error) {
        throw new Error('Error al obtener el ID del usuario: ' + error);
    }
}

async function getDataOfPac (id_pac){
    try{
        const row = await pool.query('SELECT * FROM PACIENTES WHERE id_pac = ?;', [id_pac]);
        return row;
    }catch (error){
        throw new Error('Error al obtener los datos del paciente: ' + error);
    }
}

async function getAllCitas (){
    try{
        const[rows] = await pool.query('SELECT * FROM CITA c, DOCTORES d WHERE c.id_doc = d.id_doc;')
        return rows;
    }catch (error){
        throw new Error('Error al obtener los datos del paciente: ' + error);
    }
}

async function updateCita(id_cita, nuevoEstado_cita, comentario_cita){
    try{
        await pool.query('UPDATE CITA SET comentario_doc_cita = ?, estado_cita = ? WHERE id_cita = ?', [comentario_cita, nuevoEstado_cita, id_cita])
    }catch{
        throw new Error('Error al actualizar los datos de la cita: ' + error);
    }
}

async function getBookedSlots(date) {
    try {
        const [rows] = await pool.query('SELECT DISTINCT hora_cita FROM CITA WHERE fecha_realizar_cita = ?;', [date]);
        return rows;
    } catch (error) {
        throw new Error('Error al obtener los horarios reservados: ' + error);
    }
}

async function getUserByEmail(email) {
    try {
        const [rows] = await pool.execute('SELECT * FROM USERS WHERE email_user = ?;', [email]);
        return rows;
    } catch (error) {
        throw new Error('Error al obtener información: ' + error);
    }
}

async function getUserByCedula(cedula) {
    try {
        const [rows] = await pool.execute('SELECT * FROM USERS WHERE cedula_user = ?;', [cedula]);
        return rows;
    } catch (error) {
        throw new Error('Error al obtener información: ' + error);
    }
}

async function updateIdUserPac(Names, SurNames, cedula, fecha_nac, email, id_users){
    try {
        await pool.execute('UPDATE PACIENTES SET nombres_pac = ?, apellidos_pac = ?, fecha_nac_pac = ?, email_pac = ?, id_user = ? WHERE cedula_pac=?', [Names, SurNames, fecha_nac, email, id_users, cedula]);
    } catch (error) {
        throw new Error('Error al actualizar la información: ' + error);
    }
}

async function verifyUserDetails(Names, SurNames, cedula, email, username) {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM USERS u JOIN PACIENTES p ON u.id_user = p.id_user WHERE p.nombres_pac = ? AND p.apellidos_pac = ? AND p.cedula_pac = ? AND p.email_pac = ? AND u.username_user = ?;',
            [Names, SurNames, cedula, email, username]
        );
        return rows.length > 0;
    } catch (error) {
        throw new Error('Error al verificar los datos: ' + error);
    }
}

async function updateUserPassword(username, newPassword) {
    try {
        await pool.execute('UPDATE USERS SET password_user = ? WHERE username_user = ?;', [newPassword, username]);
    } catch (error) {
        throw new Error('Error al actualizar la contraseña: ' + error);
    }
}

async function getSecretarios() {
    try {
        const [rows] = await pool.execute('SELECT cedula_sec AS cedula, nombres_sec AS nombre, apellidos_sec AS apellido FROM SECRETARIOS;');
        return rows;
    } catch (error) {
        throw new Error('Error al obtener información: ' + error);
    }
}

async function getDoctores() {
    try {
        const [rows] = await pool.execute('SELECT id_doc, cedula_doc AS cedula, nombres_doc AS nombre, apellidos_doc AS apellido FROM DOCTORES;');
        return rows;
    } catch (error) {
        throw new Error('Error al obtener información: ' + error);
    }
}

export {
    getPacienteCedulaId,
    updateIdUserPac,
    getIdUserPac,
    getInfoByCedula,
    getDoctores,
    addUserSecretario,
    addSecretarioInfo,
    getSecretarioCedula,
    getSecretarioEmail,
    addUserDoctor,
    addDoctorInfo,
    getDoctorCedula,
    getDoctorEmail,
    updateCita,
    getAllCitas,
    getDataOfPac,
    getRoles,
    getUserName,
    getInfo,
    getCitasDoc,
    getCitasPac,
    getCitaId,
    getCitaDayRangeRegistro,
    getCitaDayRangeRealizado,
    addUser,
    addCita,
    addDependent,
    addPacienteInfo,
    getPacienteEmail,
    getPacienteCedula,
    getFechaRegistro,
    getDependentsByPac,
    getDependentsByCedula,
    getCitaForIdOfPac,
    getIdOfUser,
    getId,
    getDependantForIdOfPac,
    getCitaForIdOfDoc,
    getBookedSlots,
    getUserByEmail,
    getUserByCedula,
    verifyUserDetails,
    updateUserPassword,
    getSecretarios
}

