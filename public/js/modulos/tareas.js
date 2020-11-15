import Axios from "axios";
import axios from "axios";
import Swal from "sweetalert2";

import {actualizarAvance} from '../funciones/avance'

const tareas = document.querySelector(".listado-pendientes");

if (tareas) {
  tareas.addEventListener("click", (e) => {
    //cuando se completan o desacompletan las tareas
    if (e.target.classList.contains("fa-check-circle")) {
      const icono = e.target;
      const idTarea = icono.parentElement.parentElement.dataset.tarea;
      const url = `${location.origin}/tareas/${idTarea}`;
      axios.patch(url, { idTarea }).then(function (respuesta) {
        if (respuesta.status === 200) {
          icono.classList.toggle("completo");

          actualizarAvance()
        }
      });
    }

    //Cuando se borran las tareas
    if (e.target.classList.contains("fa-trash")) {
      const tareaHTML = e.target.parentElement.parentElement,
        idTarea = tareaHTML.dataset.tarea;
      Swal.fire({
        title: "¿Deseas eliminar esta tarea",
        text: "Si lo hace, no podrá recuperar la tarea",
        icon: "error",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, borrar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.value) {
          //Enviar el delete por Axios
          const url = `${location.origin}/tareas/${idTarea}`;
          Axios.delete(url, { params: { idTarea } }).then((respuesta) => {
            if (respuesta.status === 200) {
              //Eliminar el nodo
              tareaHTML.parentElement.removeChild(tareaHTML);
              //Opcional
              Swal.fire("Tarea eliminada", respuesta.data, "success");
              actualizarAvance()
            }
          });
        }
      });
    }
  });
}

export default tareas;
