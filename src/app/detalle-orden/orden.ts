export class Orden {
    id = "";
    usuario = {
            id: "",
            nombre: "",
            username: "",
            dni: "",
            apellidoPaterno: "",
            apellidoMaterno: "",
            estado: "",
            rol: {
                id: "",
                nombre: "",
                estado: ""
            }
    };
    
    destino = "";
    puntoLlegada = "";
    proveedor = {
          nombre:"",
          ruc:""
    };
    
    fechaEntrada = "";
    observacion = "";
    productos = [
            {
                id: "",
                descripcion: "",
                ubicacion: "",
                peso: "",
                serie: "",
                cantidad: "",
                estadoProducto: "",
                categoria: {
                    id: "",
                    nombre: "",
                    estado: ""
                },
                almacen: {
                    id: "",
                    nombre: "",
                    ubicacion: "",
                    estado: ""
                },
                estado: ""
            }
        ];

    fechaSalida = "";
    
}
