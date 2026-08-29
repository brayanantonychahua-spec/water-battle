// ======================================================
// FIREBASE
// ======================================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


// ======================================================
// CONFIGURACIÓN FIREBASE
// ======================================================

const firebaseConfig = {

    apiKey:
        "AIzaSyCOV3drysmHR5ggTdMmcePKb_YmZP7swYI",

    authDomain:
        "antonyyvettwaterbattle.firebaseapp.com",

    projectId:
        "antonyyvettwaterbattle",

    storageBucket:
        "antonyyvettwaterbattle.firebasestorage.app",

    messagingSenderId:
        "742627299833",

    appId:
        "1:742627299833:web:0ff27af838bdc244946d28",

    measurementId:
        "G-KM1LRE803H"

};


// ======================================================
// INICIAR FIREBASE
// ======================================================

const app =
    initializeApp(firebaseConfig);

const auth =
    getAuth(app);

const db =
    getFirestore(app);


// ======================================================
// CONFIGURACIÓN
// ======================================================

const META = 2000;


// ======================================================
// ELEMENTOS
// ======================================================

const intro =
    document.getElementById("intro");

const loading =
    document.getElementById("loading");

const progress =
    document.querySelector(".progress");

const loadingText =
    document.getElementById("loadingText");

const login =
    document.getElementById("login");

const emailInput =
    document.getElementById("emailInput");

const passwordInput =
    document.getElementById("passwordInput");

const loginButton =
    document.getElementById("loginButton");

const loginMessage =
    document.getElementById("loginMessage");

const menu =
    document.getElementById("menu");

const welcomeUser =
    document.getElementById("welcomeUser");

const logoutButton =
    document.getElementById("logoutButton");

const waterBattle =
    document.getElementById("waterBattle");

const waterBattleButton =
    document.getElementById("waterBattleButton");

const backToMenu =
    document.getElementById("backToMenu");

const waterModal =
    document.getElementById("waterModal");

const waterInput =
    document.getElementById("waterInput");

const addWater =
    document.getElementById("addWater");

const cancelWater =
    document.getElementById("cancelWater");


// ======================================================
// ESTADO
// ======================================================

let jugador = null;

let cargaTerminada = false;

let authComprobada = false;

let datosAntonyListos = false;

let datosYvettListos = false;

let firestoreListo = false;


// ======================================================
// DATOS
// ======================================================

let agua = {

    antony: 0,

    yvett: 0

};


let historial = {

    antony: [],

    yvett: []

};


// ======================================================
// LISTENERS FIRESTORE
// ======================================================

let detenerAntony = null;

let detenerYvett = null;


// ======================================================
// FECHA
// ======================================================

function obtenerFecha() {

    const fecha =
        new Date();

    const año =
        fecha.getFullYear();

    const mes =
        String(
            fecha.getMonth() + 1
        ).padStart(2, "0");

    const dia =
        String(
            fecha.getDate()
        ).padStart(2, "0");

    return `${año}-${mes}-${dia}`;

}

const hoy =
    obtenerFecha();


// ======================================================
// REFERENCIAS
// ======================================================

const antonyRef =
    doc(
        db,
        "batallas",
        hoy,
        "jugadores",
        "antony"
    );


const yvettRef =
    doc(
        db,
        "batallas",
        hoy,
        "jugadores",
        "yvett"
    );


// ======================================================
// IDENTIFICAR JUGADOR
// ======================================================

function identificarJugador(email) {

    if (
        email ===
        "antony@waterbattle.app"
    ) {

        return "antony";

    }


    if (
        email ===
        "yvett@waterbattle.app"
    ) {

        return "yvett";

    }


    return null;

}


// ======================================================
// OCULTAR TODAS LAS PANTALLAS
// ======================================================

function ocultarTodo() {

    intro.style.display =
        "none";

    loading.style.display =
        "none";

    login.style.display =
        "none";

    menu.style.display =
        "none";

    waterBattle.style.display =
        "none";

}


// ======================================================
// MOSTRAR LOGIN
// ======================================================

function mostrarLogin() {

    ocultarTodo();

    login.style.display =
        "flex";

}


// ======================================================
// MOSTRAR MENÚ
// ======================================================

function mostrarMenu() {

    ocultarTodo();

    menu.style.display =
        "flex";


    if (
        jugador ===
        "antony"
    ) {

        welcomeUser.textContent =
            "Bienvenido Antony 😎";

    }

    else if (
        jugador ===
        "yvett"
    ) {

        welcomeUser.textContent =
            "Bienvenida Yvett 😈";

    }

}


// ======================================================
// COMPROBAR SI FIRESTORE ESTÁ LISTO
// ======================================================

function comprobarFirestoreListo() {

    if (
        datosAntonyListos &&
        datosYvettListos
    ) {

        firestoreListo =
            true;

        waterBattleButton.disabled =
            false;

        waterBattleButton.style.opacity =
            "1";

        waterBattleButton.textContent =
            "⚔️ BATALLA DE AGUA";

    }

}


// ======================================================
// MOSTRAR BATALLA
// ======================================================

function mostrarBatalla() {

    if (
        !jugador
    ) {

        return;

    }


    if (
        !firestoreListo
    ) {

        alert(
            "⏳ Cargando los datos de la batalla..."
        );

        return;

    }


    ocultarTodo();

    waterBattle.style.display =
        "block";


    configurarBotones();

    actualizarPantalla();

}


// ======================================================
// LOGIN
// ======================================================

loginButton.addEventListener(

    "click",

    async () => {

        const email =
            emailInput.value
                .trim()
                .toLowerCase();

        const password =
            passwordInput.value;


        if (
            !email ||
            !password
        ) {

            loginMessage.textContent =
                "Introduce correo y contraseña.";

            return;

        }


        loginMessage.textContent =
            "Iniciando sesión...";

        loginButton.disabled =
            true;


        try {

            await signInWithEmailAndPassword(

                auth,

                email,

                password

            );

        }

        catch (error) {

            console.error(
                "ERROR FIREBASE:",
                error
            );

            console.error(
                "CODE:",
                error.code
            );

            console.error(
                "MESSAGE:",
                error.message
            );


            loginMessage.textContent =
                `❌ ${error.code}`;

        }

        finally {

            loginButton.disabled =
                false;

        }

    }

);


// ======================================================
// ENTER EN LOGIN
// ======================================================

passwordInput.addEventListener(

    "keydown",

    (event) => {

        if (
            event.key ===
            "Enter"
        ) {

            loginButton.click();

        }

    }

);


// ======================================================
// AUTENTICACIÓN
// ======================================================

onAuthStateChanged(

    auth,

    (user) => {

        authComprobada =
            true;


        if (
            user
        ) {

            const jugadorDetectado =
                identificarJugador(
                    user.email
                );


            if (
                !jugadorDetectado
            ) {

                alert(
                    "Usuario no autorizado."
                );

                signOut(auth);

                return;

            }


            jugador =
                jugadorDetectado;


            // Reiniciar estado de Firestore

            datosAntonyListos =
                false;

            datosYvettListos =
                false;

            firestoreListo =
                false;


            // Empezar a escuchar
            // Firestore AHORA que
            // sabemos quién inició sesión.

            iniciarFirestore();


            if (
                cargaTerminada
            ) {

                mostrarMenu();

            }

        }

        else {

            jugador =
                null;

            detenerFirestore();


            datosAntonyListos =
                false;

            datosYvettListos =
                false;

            firestoreListo =
                false;


            if (
                cargaTerminada
            ) {

                mostrarLogin();

            }

        }

    }

);


// ======================================================
// CERRAR SESIÓN
// ======================================================

logoutButton.addEventListener(

    "click",

    async () => {

        try {

            await signOut(auth);

        }

        catch (error) {

            console.error(
                error
            );

        }

    }

);


// ======================================================
// ABRIR BATALLA
// ======================================================

waterBattleButton.addEventListener(

    "click",

    () => {

        mostrarBatalla();

    }

);


// ======================================================
// VOLVER AL MENÚ
// ======================================================

backToMenu.addEventListener(

    "click",

    () => {

        waterModal.style.display =
            "none";

        mostrarMenu();

    }

);


// ======================================================
// PANTALLA DE CARGA
// ======================================================

setTimeout(

    () => {

        intro.style.display =
            "none";

        loading.style.display =
            "flex";


        let porcentaje =
            0;


        const intervalo =
            setInterval(

                () => {

                    porcentaje++;


                    progress.style.width =
                        porcentaje + "%";


                    loadingText.textContent =
                        `Cargando... ${porcentaje}%`;


                    if (
                        porcentaje >=
                        100
                    ) {

                        clearInterval(
                            intervalo
                        );


                        setTimeout(

                            () => {

                                cargaTerminada =
                                    true;


                                loading.style.display =
                                    "none";


                                if (
                                    authComprobada &&
                                    auth.currentUser &&
                                    jugador
                                ) {

                                    mostrarMenu();

                                }

                                else {

                                    mostrarLogin();

                                }

                            },

                            500

                        );

                    }

                },

                30

            );

    },

    2000

);


// ======================================================
// INICIAR FIRESTORE
// ======================================================

function iniciarFirestore() {

    // Detener listeners anteriores

    detenerFirestore();


    // ------------------------------------------
    // ANTONY
    // ------------------------------------------

    detenerAntony =
        onSnapshot(

            antonyRef,

            (snapshot) => {

                if (
                    snapshot.exists()
                ) {

                    const datos =
                        snapshot.data();


                    agua.antony =
                        Number(
                            datos.agua || 0
                        );


                    historial.antony =
                        Array.isArray(
                            datos.historial
                        )
                            ? datos.historial
                            : [];

                }

                else {

                    agua.antony =
                        0;

                    historial.antony =
                        [];

                }


                datosAntonyListos =
                    true;


                comprobarFirestoreListo();

                actualizarPantalla();

            },

            (error) => {

                console.error(
                    "ERROR FIRESTORE ANTONY:",
                    error
                );

            }

        );


    // ------------------------------------------
    // YVETT
    // ------------------------------------------

    detenerYvett =
        onSnapshot(

            yvettRef,

            (snapshot) => {

                if (
                    snapshot.exists()
                ) {

                    const datos =
                        snapshot.data();


                    agua.yvett =
                        Number(
                            datos.agua || 0
                        );


                    historial.yvett =
                        Array.isArray(
                            datos.historial
                        )
                            ? datos.historial
                            : [];

                }

                else {

                    agua.yvett =
                        0;

                    historial.yvett =
                        [];

                }


                datosYvettListos =
                    true;


                comprobarFirestoreListo();

                actualizarPantalla();

            },

            (error) => {

                console.error(
                    "ERROR FIRESTORE YVETT:",
                    error
                );

            }

        );

}


// ======================================================
// DETENER FIRESTORE
// ======================================================

function detenerFirestore() {

    if (
        detenerAntony
    ) {

        detenerAntony();

        detenerAntony =
            null;

    }


    if (
        detenerYvett
    ) {

        detenerYvett();

        detenerYvett =
            null;

    }

}


// ======================================================
// CONFIGURAR BOTONES DE REGISTRO
// ======================================================

function configurarBotones() {

    const botones =
        document.querySelectorAll(
            ".register-button"
        );


    botones.forEach(

        (button, index) => {

            const propietario =
                index === 0
                    ? "antony"
                    : "yvett";


            button.onclick =
                null;


            if (
                propietario ===
                jugador
            ) {

                button.style.display =
                    "block";

                button.disabled =
                    false;


                button.onclick =
                    () => {

                        if (
                            !jugador ||
                            !firestoreListo
                        ) {

                            return;

                        }


                        waterModal.style.display =
                            "flex";


                        waterInput.value =
                            "";


                        setTimeout(

                            () => {

                                waterInput.focus();

                            },

                            50

                        );

                    };

            }

            else {

                button.style.display =
                    "none";

                button.disabled =
                    true;

            }

        }

    );

}


// ======================================================
// AGREGAR AGUA
// ======================================================

addWater.addEventListener(

    "click",

    async () => {

        if (
            !jugador ||
            !firestoreListo
        ) {

            return;

        }


        const cantidad =
            Number(
                waterInput.value
            );


        if (
            !cantidad ||
            cantidad <= 0
        ) {

            alert(
                "Introduce una cantidad válida 💧"
            );

            return;

        }


        const referencia =
            jugador ===
            "antony"
                ? antonyRef
                : yvettRef;


        const nuevaCantidad =
            (
                agua[jugador] || 0
            ) +
            cantidad;


        const nuevoRegistro = {

            cantidad:
                cantidad,

            hora:
                new Date()
                    .toLocaleTimeString(
                        [],
                        {
                            hour:
                                "2-digit",

                            minute:
                                "2-digit"
                        }
                    )

        };


        const nuevoHistorial = [

            ...(historial[jugador] || []),

            nuevoRegistro

        ];


        addWater.disabled =
            true;


        try {

            await setDoc(

                referencia,

                {

                    jugador:
                        jugador,

                    agua:
                        nuevaCantidad,

                    historial:
                        nuevoHistorial,

                    fecha:
                        hoy

                }

            );


            waterModal.style.display =
                "none";


            waterInput.value =
                "";

        }

        catch (error) {

            console.error(
                "ERROR FIRESTORE:",
                error
            );


            alert(
                "No se pudo guardar 😭\n\n" +
                error.message
            );

        }

        finally {

            addWater.disabled =
                false;

        }

    }

);


// ======================================================
// ENTER PARA AGUA
// ======================================================

waterInput.addEventListener(

    "keydown",

    (event) => {

        if (
            event.key ===
            "Enter"
        ) {

            addWater.click();

        }

    }

);


// ======================================================
// CANCELAR
// ======================================================

cancelWater.addEventListener(

    "click",

    () => {

        waterModal.style.display =
            "none";

    }

);


// ======================================================
// ACTUALIZAR PANTALLA
// ======================================================

function actualizarPantalla() {

    const jugadores =
        document.querySelectorAll(
            ".player"
        );


    if (
        jugadores.length <
        2
    ) {

        return;

    }


    const nombres = [

        "antony",

        "yvett"

    ];


    nombres.forEach(

        (nombre, index) => {

            const elemento =
                jugadores[index];


            const cantidad =
                Number(
                    agua[nombre] || 0
                );


            const porcentaje =
                Math.min(

                    (
                        cantidad /
                        META
                    ) *
                    100,

                    100

                );


            const amount =
                elemento.querySelector(
                    ".amount"
                );


            if (
                amount
            ) {

                amount.textContent =
                    `${cantidad.toLocaleString()} ml`;

            }


            const percentage =
                elemento.querySelector(
                    ".percentage"
                );


            if (
                percentage
            ) {

                percentage.textContent =
                    `${Math.round(
                        porcentaje
                    )}%`;

            }


            const barra =
                elemento.querySelector(
                    ".progress-player-fill"
                );


            if (
                barra
            ) {

                barra.style.width =
                    `${porcentaje}%`;

            }


            const parrafo =
                elemento.querySelector(
                    "p"
                );


            if (
                parrafo
            ) {

                parrafo.textContent =
                    `${cantidad.toLocaleString()} / ${META.toLocaleString()} ml`;

            }


            const aguaVisual =
                elemento.querySelector(
                    ".human-bottle .water"
                );


            if (
                aguaVisual
            ) {

                aguaVisual.style.height =
                    `${porcentaje}%`;

            }

        }

    );


    actualizarHistorial();

    actualizarGanador();

}


// ======================================================
// HISTORIAL
// ======================================================

function actualizarHistorial() {

    const jugadores =
        document.querySelectorAll(
            ".player"
        );


    if (
        jugadores.length <
        2
    ) {

        return;

    }


    const nombres = [

        "antony",

        "yvett"

    ];


    nombres.forEach(

        (nombre, index) => {

            const lista =
                jugadores[index]
                    .querySelector(
                        ".history-list"
                    );


            if (
                !lista
            ) {

                return;

            }


            lista.innerHTML =
                "";


            (
                historial[nombre] ||
                []
            )
                .forEach(

                    (
                        registro,
                        registroIndex
                    ) => {

                        const item =
                            document.createElement(
                                "div"
                            );


                        item.className =
                            "history-item";


                        const texto =
                            document.createElement(
                                "span"
                            );


                        texto.textContent =
                            `💧 +${registro.cantidad} ml · ${registro.hora}`;


                        const borrar =
                            document.createElement(
                                "button"
                            );


                        borrar.className =
                            "delete-water";


                        borrar.textContent =
                            "🗑️";


                        if (
                            jugador !==
                            nombre
                        ) {

                            borrar.style.display =
                                "none";

                        }


                        borrar.onclick =
                            () => {

                                eliminarRegistro(
                                    nombre,
                                    registroIndex
                                );

                            };


                        item.appendChild(
                            texto
                        );


                        item.appendChild(
                            borrar
                        );


                        lista.appendChild(
                            item
                        );

                    }

                );

        }

    );

}


// ======================================================
// ELIMINAR REGISTRO
// ======================================================

async function eliminarRegistro(

    nombre,

    index

) {

    if (
        jugador !==
        nombre
    ) {

        return;

    }


    if (
        !firestoreListo
    ) {

        return;

    }


    const registros =
        [
            ...(historial[nombre] || [])
        ];


    if (
        !registros[index]
    ) {

        return;

    }


    const cantidad =
        Number(
            registros[index].cantidad || 0
        );


    registros.splice(
        index,
        1
    );


    const nuevaAgua =
        Math.max(

            0,

            (
                agua[nombre] || 0
            ) -
            cantidad

        );


    const referencia =
        nombre ===
        "antony"
            ? antonyRef
            : yvettRef;


    try {

        await setDoc(

            referencia,

            {

                jugador:
                    nombre,

                agua:
                    nuevaAgua,

                historial:
                    registros,

                fecha:
                    hoy

            }

        );

    }

    catch (error) {

        console.error(
            "ERROR AL ELIMINAR:",
            error
        );


        alert(
            "No se pudo eliminar el registro 😭"
        );

    }

}


// ======================================================
// GANADOR
// ======================================================

function actualizarGanador() {

    const winner =
        document.querySelector(
            ".winner"
        );


    if (
        !winner
    ) {

        return;

    }


    if (
        agua.antony >
        agua.yvett
    ) {

        winner.textContent =
            "🏆 ANTONY VA GANANDO";

    }

    else if (
        agua.yvett >
        agua.antony
    ) {

        winner.textContent =
            "🏆 YVETT VA GANANDO";

    }

    else {

        winner.textContent =
            "🤝 EMPATE";

    }

}