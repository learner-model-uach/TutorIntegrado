
** ESTE README ES SÓLO PARA DESPLEGAR o VER LA APP EN EL SERVER DEL CURSO **

***************************************************************************************************************
INSTALAR SSH (WINDOWS)
***************************************************************************************************************

[*] Verificar que tenemos instalado SSH:
	a) En "cmd" escribir "ssh" y presionar enter
	b) Si SSH está instalado verás algo como: "usage: ssh [-46AaCfGgKkMN ..."
	c) Si NO está instalado verás algo como: "ssh is not recognized as ..."
	d) Comprobar si el servidor SSH está instalado (LINUX)(OPCIONAL):
		sudo systemctl status ssh
		- Si está instalado, verás el estado del servicio "active (running)"
		- Si no está instalado, te mostrará un mensaje de error

[*] Instalar SSH:
	a) Instalar el CLIENTE SSH:
		Configuracion -> Sistema -> Características opcionales -> Agregar una característica opcional
		En el cuadro de búsqueda, escribe "Cliente de OpenSSH"
		Seleccionalo y haz clic en "Siguiente" y luego en "Agregar"
	b) Instalar el SERVIDOR SSH (Para recibir conexiones SSH)(OPCIONAL):
		Configuracion -> Sistema -> Características opcionales -> Agregar una característica opcional
		En el cuadro de búsqueda, escribe "Servidor de OpenSSH"
		Seleccionalo y haz clic en "Siguiente" y luego en "Agregar"

***************************************************************************************************************
INSTALAR y EJECUTAR VPN de la UACh (NECESARIO para entrar al server)
***************************************************************************************************************

[1] Ingresar a https://www.fortinet.com/support/product-downloads
[2] Seleccionar "FortiClient VPN Only"
[3] Seleccionar Windows/Downloads
[4] Ejecutar el archivo descargado y esperar a que termine la instalación

[5] Ejecutar acceso directo creado en el escritorio
[6] Ingresar a configurar VPN
[7] Ingresar los siguientes datos:
    Nombre de Conexión: VPN UACh 
    Descripción: Conexión UACh 
    Gateway Remoto: vpn.uach.cl 
    Método de Autenticación: Clave pre-compartida 
    Clave pre-compartida: uaustral.,2016
[8] Presionar el botón guardar
[9] Ingresar con credenciales de "infoalumnos" o "siveducmd"
    - Así debe ingresarse el Rut: 20123456-7

[*] Para desconectar la VPN:
    a) buscar el icono de FortiClient en la bandeja de apps ocultas
    b) click derecho y darle a "Desconectar VPN UACh"

***************************************************************************************************************
Conectarse al SERVER/HOST del curso
***************************************************************************************************************
NOTAS:
	- ssh nombreServer@ipServidor -p nroDePuerto
	- Para conectarse al server NO es necesario especificar un puerto
	- En los puertos 3007 y 4007 se despliega la APP

[*] En "cmd" ejecutar:
		ssh grupo7@146.83.216.166
		password: 8Go9hjhP

***************************************************************************************************************
Crear IMAGEN Docker del PROYECTO
***************************************************************************************************************
NOTAS:
- ANTES de crear una nueva imagen, verificar si ya hay una existente que corresponda al proyecto
- NO es necesario hacer "gitclone" del proyecto, ya que el propio dockerfile lo hace e instala TODO

	[*] Para Ver las imagenes existentes, ejecutar en "bash":
		docker images

	[*] Para crear la imagen:
		Estando en el MISMO directorio del archivo "Docker", ejecutar en "bash":
			docker build -t mateotutorimg . cmd

***************************************************************************************************************
Ejecutar un NUEVO CONTAINER basado en una IMAGEN Docker
***************************************************************************************************************
NOTA:
- ANTES de ejecutar un container, verificar si ya hay alguno en ejecucion que corresponda al proyecto
- Un contenedor es una instancia en ejecución de una imagen
- Al ejecutar una imagen, se ejecuta un nuevo "contenedor" basado en dicha imagen
- Se pueden ejecutar simultaneamente distintos "contenedores" basados en una misma imagen

[*] Ejecutar en "bash":
	docker run --name MateoCont -p 3007:3000 mateotutorimg

	- 3007 Es el puerto de la maquina host (server)
	- 3000 Es el puerto dentro del contenedor Docker

[*] Ver la APP en ejecucion:
	http://146.83.216.166:5007/

***************************************************************************************************************
Comandos útiles DOCKER
***************************************************************************************************************

	[*] Ver las imagenes EXISTENTES
		docker images

	[*] Ver TODOS los contenedores EXISTENTES
		docker ps -a

	[*] Ver SÓLO los contenedores en EJECUCIÓN
		docker ps

	[*] Iniciar la ejecucion de un contenedor EXISTENTE
		docker start Mateo

	[*] Detener la ejecucion de un contenedor
		docker stop Mateo

	[*] Eliminar un contenedor detenido
		docker rm Mateo

***************************************************************************************************************
CREDENCIALES para el LOGIN en MateoTutor
***************************************************************************************************************

nicole.navarro@alumnos.uach.cl
123456