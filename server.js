import express from "express";
import * as Queries from "./db/queries.js";
import { PORT } from "./config/config.js"
import { pool } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 5000; 

app.get("/api/status", async (req, res) => {
  try {
    const rows = await Queries.getRoles();

    res.json({ message: "Conexión a la base de datos exitosa" });
  } catch (error) {
    res.status(500).json({ message: "Error al conectar con la base de datos", error: error.message });
  }
});

app.get("/api/user/:username", async (req, res) => {
  try {
      const user = await Queries.getUserName(req.params.username);
      if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
      res.json(user);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

app.post("/api/register", async (req, res) => {
  try {
      const { Names, SurNames, cedula, fecha_nac, email, username, password } = req.body;

      if (!Names || !SurNames || !fecha_nac || !email || !username || !password || !cedula) {
          return res.status(400).json({ message: "Debe llenar todos los campos" });
      }

      const existeUSER = await Queries.getUserName(username);

      if (Array.isArray(existeUSER) && existeUSER.length > 0) {
        return res.status(409).json({ message: "El nombre de usuario ya está en uso" });
      }

      const existeEMAILUSERS = await Queries.getPacienteEmail(email);
      const cedulaUSERS = await Queries.getPacienteCedulaId(cedula);
      const validate_id_user = await Queries.getIdUserPac(cedula);
      const id_users = await Queries.addUser(username, password);

      if ((Array.isArray(cedulaUSERS) && cedulaUSERS.length > 0) && (validate_id_user.length > 0 && validate_id_user[0].id_user === null)) {
        await Queries.updateIdUserPac(Names, SurNames, cedula, fecha_nac, email, id_users);
      } else if (validate_id_user.length === 0) {
        if (Array.isArray(existeEMAILUSERS) && existeEMAILUSERS.length > 0) {
          return res.status(409).json({ message: "El email de usuario ya está en uso" });
        }
        await Queries.addPacienteInfo(Names, SurNames, cedula, fecha_nac, email, id_users);
      }

      res.status(201).json({ message: "El usuario se registró correctamente" });
  } catch (error) {
      if (error.message === 'El nombre de usuario ya está en uso') {
          res.status(409).json({ message: error.message });
      } else {
          res.status(500).json({ message: error.message });
      }
  }
});

app.post("/api/registerFromDoc", async (req, res) => {
  try {
      const { Names, SurNames, cedula, fecha_nac, email } = req.body;

      if (!Names || !SurNames || !fecha_nac || !email || !cedula) {
          return res.status(400).json({ message: "Debe llenar todos los campos" });
      }

      const existeEMAILUSERS = await Queries.getPacienteEmail(email);

      if (Array.isArray(existeEMAILUSERS) && existeEMAILUSERS.length > 0) {
        return res.status(409).json({ message: "El email de usuario ya está en uso" });
      }

      const cedulaUSERS = await Queries.getPacienteCedula(cedula);

      console.log('hola1');

      if (Array.isArray(cedulaUSERS) && cedulaUSERS.length > 0) {
        return res.status(409).json({ message: "La cédula de usuario ya está en uso" });
      }      

      console.log('hola');

      await Queries.addPacienteInfo(Names, SurNames, cedula, fecha_nac, email, null);
      
      res.status(201).json({ message: "El paciente se registró correctamente" });
  } catch (error) {
      if (error.message === 'El nombre de usuario ya está en uso') {
          res.status(409).json({ message: error.message });
      } else {
          res.status(500).json({ message: error.message });
      }
  }
});

app.post("/api/login", async (req, res) => {
  try {
      const { username, password } = req.body;

      if (!username || !password) {
          return res.status(400).json({ message: "Debe llenar todos los campos" });
      }

      const users = await Queries.getUserName(username);
      console.log(users);

      if (users.length === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const user = users[0];

      if (user.password_user !== password) {
          return res.status(401).json({ message: "Contraseña incorrecta" });
      }

      let state = '';

      switch(user.id_rol){
        case 1:
          state = 'administrador';
          break;
        case 2:
          state = 'medico';
          break;
        case 3:
          state = 'paciente';
          break;
        case 4:
          state = 'secretario';
          break;
      }
      

      res.status(200).json({ message: "Ha iniciado sesion correctamente", userType: state });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

app.post("/api/agendarPaciente", async (req, res) => {
  try {
    const { nombre_paciente_cita, apellido_paciente_cita, cedula_paciente_cita, asunto_cita, fecha_registro_cita, fecha_realizar_cita, hora_cita, valor_cita, comentario_pac_cita, id_pac, id_doc } = req.body;

    console.log(nombre_paciente_cita, apellido_paciente_cita, cedula_paciente_cita, asunto_cita, fecha_registro_cita, fecha_realizar_cita, hora_cita, valor_cita, comentario_pac_cita, id_pac, id_doc);

    if (!nombre_paciente_cita || !apellido_paciente_cita || !cedula_paciente_cita || !asunto_cita || !fecha_registro_cita || !fecha_realizar_cita || !hora_cita || !valor_cita || !id_doc) {
      return res.status(400).json({ message: "Debe llenar todos los campos" });
    }

    let patientId = id_pac;
    if (!patientId) {
      console.log('Fetching patient ID by cedula');
      const patient = await Queries.getPacienteCedula(cedula_paciente_cita);
      console.log('Patient ID:', patient);
      if (!patient) {
        return res.status(404).json({ message: "Paciente no encontrado" });
      }
      patientId = patient.id_pac;
    }

    console.log(patientId);

    await Queries.addCita(nombre_paciente_cita, apellido_paciente_cita, cedula_paciente_cita, asunto_cita, fecha_registro_cita, fecha_realizar_cita, hora_cita, valor_cita, null, comentario_pac_cita,"pendiente", id_doc, patientId);

    res.status(201).json({ message: "La cita fue registrada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/getIdMedico", async (req, res) => {
  try {
    const {user} = req.body;

    const id_user = await Queries.getIdOfUser(user);

    if (!id_user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const id_doc = await Queries.getId(id_user);

    if (!id_doc) {
      return res.status(404).json({ message: "No encontrado" });
    }
    res.json({id_doc: id_doc});
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el id: " + error.message });
  }
});

app.post("/api/historialCitas", async (req, res) => {
  try {
    const { user } = req.body;

    const id_user = await Queries.getIdOfUser(user);

    if (!id_user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const userInfo = await Queries.getInfo('USERS', id_user);

    if (!userInfo) {
      return res.status(404).json({ message: "Información del usuario no encontrada" });
    }

    let citas = [];

    if (userInfo.id_rol === 3) { // Paciente
      const id_pac = await Queries.getId(id_user);
      citas = await Queries.getCitaForIdOfPac(id_pac);
    } else if (userInfo.id_rol === 2) { // Doctor
      const id_doc = await Queries.getId(id_user);
      citas = await Queries.getCitaForIdOfDoc(id_doc);
    } else {
      return res.status(400).json({ message: "Rol de usuario no válido para esta operación" });
    }

    return res.status(200).json({
      success: true,
      message: citas.length > 0 ? "Citas obtenidas exitosamente." : "No hay citas registradas.",
      data: citas
    });

  } catch (error) {
    res.status(500).json({ message: "Error al obtener las citas: " + error.message });
  }
});

app.post("/api/getPacInfo", async (req, res) => {
  try {
    const { cedula_paciente_cita} = req.body;

    const pacInfo = await Queries.getInfoByCedula('PACIENTES', cedula_paciente_cita);

    if (pacInfo.length === 0){
      return res.status(404).json({ message: "Paciente no encontrado" });
    }
    return res.status(200).json({
      success: true,
      message: pacInfo.length > 0 ? "Datos obtenidos exitosamente." : "No hay datos registrados.",
      data: pacInfo
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los datos del pacientes: " + error.message });
  }
});

app.post("/api/historialCitasTodos", async (req, res) => {
  try {
    const infoCitas = await Queries.getAllCitas();

    return res.status(200).json({
      success: true,
      message: infoCitas.length > 0 ? "Citas obtenidas exitosamente." : "No hay citas registradas.",
      data: infoCitas
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las citas del pacientes: " + error.message });
  }
});

app.post("/api/RegistroDependientes", async (req, res) => {
  try {
    const { user, cedula, nombre, apellido, fecha_nacimiento } = req.body;

    if (!user || !cedula || !nombre || !apellido || !fecha_nacimiento) {
      return res.status(400).json({ message: "Debe llenar todos los campos" });
    }

    const id_user = await Queries.getIdOfUser(user);

    if (!id_user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const id_pac = await Queries.getId(id_user);

    if (!id_pac) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

    await Queries.addDependent(cedula, nombre, apellido, fecha_nacimiento, id_pac);

    res.status(201).json({ message: "El dependiente fue registrado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar dependiente: " + error.message });
  }
});

app.post("/api/ListaDependientes", async (req, res) => {
  try{

    const {user} = req.body;

    const id_user = await Queries.getIdOfUser(user);

    if (!id_user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const id_pac = await Queries.getId(id_user);

    const infoDependientes = await Queries.getDependantForIdOfPac(id_pac);

    return res.status(200).json({
      success: true,
      message: infoDependientes.length > 0 ? "Dependientes obtenidas exitosamente." : "No hay dependientes registrados.",
      data: infoDependientes
    });

  }catch(error){
    res.status(500).json({ message: "Error al obtener las citas del pacientes"+error});
  }
});

app.post("/api/ListaDoctores", async (req, res) => {
  try{
    const infoDoctores = await Queries.getDoctores();

    return res.status(200).json({
      success: true,
      message: infoDoctores.length > 0 ? "Doctores obtenidas exitosamente." : "No hay doctores registrados.",
      data: infoDoctores
    });

  }catch(error){
    res.status(500).json({ message: "Error al obtener las citas del pacientes"+error});
  }
});

app.post("/api/DatosUser", async (req, res) => {
  console.log('Buscando datos user');
  try{
    const {user} = req.body;
    console.log(user);
    const id_user = await Queries.getIdOfUser(user);
    console.log(id_user);
    if (!id_user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    console.log('Hola');
    const id_pac = await Queries.getId(id_user);
    console.log(id_pac);
    console.log('hla');
    const paciente = await Queries.getDataOfPac(id_pac);
    console.log('adios');
    console.log(paciente);
    res.json(paciente[0]);

  }catch(error){
    res.status(500).json({ message: "Error al obtener las citas del pacientes"+error});
  }
});

app.post('/api/actualizarEstadoCita', async (req, res) => {
  try{
    const { id_cita, nuevoEstado_cita, comentario_cita} = req.body;

    console.log(id_cita);
    await Queries.updateCita(id_cita, nuevoEstado_cita, comentario_cita);
    
    res.status(201).json({ message: "El dependiente fue registrado exitosamente" });
  }catch(error){
    res.status(500).json({ message: "Error al actualizar la cita del paciente"+error});
  }
});

app.post("/api/registrarDoctor", async (req, res) => {
  try {
      const { Names, SurNames, cedula, email, username, password } = req.body;

      if (!Names || !SurNames || !email || !username || !password || !cedula) {
          return res.status(400).json({ message: "Debe llenar todos los campos" });
      }

      const existeUSER = await Queries.getUserName(username);

      if (Array.isArray(existeUSER) && existeUSER.length > 0) {
        return res.status(409).json({ message: "El nombre de usuario ya está en uso" });
      }

      const existeEMAILUSERS = await Queries.getDoctorEmail(email);

      if (Array.isArray(existeEMAILUSERS) && existeEMAILUSERS.length > 0) {
        return res.status(409).json({ message: "El email de usuario ya está en uso" });
      }

      const cedulaUSERS = await Queries.getDoctorCedula(cedula);

      if (Array.isArray(cedulaUSERS) && cedulaUSERS.length > 0) {
        return res.status(409).json({ message: "La cédula de usuario ya está en uso" });
      }      

      const id_users = await Queries.addUserDoctor(username, password);

      await Queries.addDoctorInfo(Names, SurNames, cedula, email, id_users);
      
      res.status(201).json({ message: "El usuario se registró correctamente" });
  } catch (error) {
      if (error.message === 'El nombre de usuario ya está en uso') {
          res.status(409).json({ message: error.message });
      } else {
          res.status(500).json({ message: error.message });
      }
  }
});

app.post("/api/registrarSecretario", async (req, res) => {
  try {
      const { Names, SurNames, cedula, email, username, password } = req.body;

      if (!Names || !SurNames || !email || !username || !password || !cedula) {
          return res.status(400).json({ message: "Debe llenar todos los campos" });
      }

      const existeUSER = await Queries.getUserName(username);

      if (Array.isArray(existeUSER) && existeUSER.length > 0) {
        return res.status(409).json({ message: "El nombre de usuario ya está en uso" });
      }

      const existeEMAILUSERS = await Queries.getSecretarioEmail(email);

      if (Array.isArray(existeEMAILUSERS) && existeEMAILUSERS.length > 0) {
        return res.status(409).json({ message: "El email de usuario ya está en uso" });
      }

      const cedulaUSERS = await Queries.getSecretarioCedula(cedula);

      if (Array.isArray(cedulaUSERS) && cedulaUSERS.length > 0) {
        return res.status(409).json({ message: "La cédula de usuario ya está en uso" });
      }      

      const id_users = await Queries.addUserSecretario(username, password);

      await Queries.addSecretarioInfo(Names, SurNames, cedula, email, id_users);
      
      res.status(201).json({ message: "El usuario se registró correctamente" });
  } catch (error) {
      if (error.message === 'El nombre de usuario ya está en uso') {
          res.status(409).json({ message: error.message });
      } else {
          res.status(500).json({ message: error.message });
      }
  }
});

app.get("/api/bookedSlots/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const bookedSlots = await Queries.getBookedSlots(date);
    res.status(200).json(bookedSlots);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los horarios reservados: " + error.message });
  }
});

app.post("/api/checkDuplicate", async (req, res) => {
  try {
    const { cedula, email, username } = req.body;

    const userByUsername = await Queries.getUserName(username);
    const userByEmail = await Queries.getUserByEmail(email);
    const userByCedula = await Queries.getUserByCedula(cedula);

    const isDuplicate = userByUsername.length > 0 || userByEmail.length > 0 || userByCedula.length > 0;

    res.status(200).json({ isDuplicate });
  } catch (error) {
    res.status(500).json({ message: "Error al verificar duplicados: " + error.message });
  }
});

app.post("/api/verifyUser", async (req, res) => {
  try {
    const { Names, SurNames, cedula, email, username } = req.body;
    const user = await Queries.verifyUserDetails(Names, SurNames, cedula, email, username);
    if (user) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al verificar los datos: " + error.message });
  }
});

app.post("/api/updatePassword", async (req, res) => {
  try {
    const { username, newPassword } = req.body;
    await Queries.updateUserPassword(username, newPassword);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la contraseña: " + error.message });
  }
});

app.post("/api/ListaDoctoresSecretarios", async (req, res) => {
  try {
    const doctores = await Queries.getDoctores();
    const secretarios = await Queries.getSecretarios();

    const personas = [
      ...doctores.map(doc => ({ ...doc, tipo: 'doctor' })),
      ...secretarios.map(sec => ({ ...sec, tipo: 'secretario' }))
    ];

    return res.status(200).json({
      success: true,
      message: personas.length > 0 ? "Datos obtenidos exitosamente." : "No hay datos registrados.",
      data: personas
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los datos: " + error.message });
  }
});


app.listen(PORT);

