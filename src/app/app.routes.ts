import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PaginaPrincipalComponent } from './pagina-principal/pagina-principal.component';
import { LinkRegistrarProductoComponent } from './link-registrar-producto/link-registrar-producto.component';
import { AgregarProductosComponent } from './agregar-productos/agregar-productos.component';
import { CrearUsuarioComponent } from './crear-usuario/crear-usuario.component';
import { IngresarOrdenComponent } from './ingresar-orden/ingresar-orden.component';
import { OrdenSalidaComponent } from './orden-salida/orden-salida.component';
import { GestionRolesComponent } from './gestion-roles/gestion-roles.component';
import { GestionCategoriaComponent } from './gestion-categoria/gestion-categoria.component';
import { GestionAlmacenComponent } from './gestion-almacen/gestion-almacen.component';
import { GestionProveedorComponent } from './gestion-proveedor/gestion-proveedor.component';
import { RegistroOrdenesComponent } from './registro-ordenes/registro-ordenes.component';
import { DetalleOrdenComponent } from './detalle-orden/detalle-orden.component';
import { authGuard } from './guard/auth.guard';
import { authAdminGuard } from './guard/auth-admin.guard';
import { GestionProductoComponent } from './gestion-producto/gestion-producto.component';

export const routes: Routes = [
    {path:'', redirectTo: '/login', pathMatch:'full'},
    {path:'login', component: LoginComponent},
    {path:'dashboard', component: PaginaPrincipalComponent,
        canActivate:[authGuard],
        children:[
            {path:"inicio", component: LinkRegistrarProductoComponent},
            {path:"ingresar/orden", component: IngresarOrdenComponent},
            {path:"salida/orden", component: OrdenSalidaComponent},
            {path:"crear/usuario", component: CrearUsuarioComponent, canActivate:[authAdminGuard]},
            {path:"gestion/rol", component: GestionRolesComponent},
            {path:"gestion/categoria", component: GestionCategoriaComponent},
            {path:"gestion/almacen", component: GestionAlmacenComponent},
            {path:"gestion/proveedor", component: GestionProveedorComponent},
            {path:"gestion/productos", component: GestionProductoComponent},
            {path:"ver/ordenes", component: RegistroOrdenesComponent},
            {path:"detalle/orden", component: DetalleOrdenComponent},
        ]
    },
    {path:'ingreso', component: PaginaPrincipalComponent, outlet:'aux'}
];
