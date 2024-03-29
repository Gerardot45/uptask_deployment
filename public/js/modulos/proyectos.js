import Swal from "sweetalert2";
import axios from "axios";

const btnEliminar = document.querySelector("#eliminar-proyecto");

if (btnEliminar) {
  btnEliminar.addEventListener("click", (e) => {
    //console.log('click en eliminar')
    const urlProyecto = e.target.dataset.proyectoUrl;
    Swal.fire({
      title: "¿Deseas eliminar este proyecto?",
      text: "Si lo hace, no podrá recuperarlo de nuevo",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        //enviar petición a axios
        const url = `${location.origin}/proyectos/${urlProyecto}`;

        axios
          .delete(url, { params: { urlProyecto } })
          .then(function (respuesta) {
            console.log(respuesta);

            Swal.fire("Proyecto eliminado", respuesta.data, "success");

            //redireccionar al inicio
            setTimeout(() => {
              window.location.href = "/";
            }, 3000);
          })
          .catch(()=>Swal.fire({
            icon : 'error',
            title:"Hubo un error al eliminar"
          }));
      }
    });
  });
}

export default btnEliminar;
