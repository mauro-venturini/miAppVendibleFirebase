/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const logger = require("firebase-functions/logger");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const mercadopago = require("mercadopago");

// 🔐 Configuramos Mercado Pago con tu access token
mercadopago.configure({
  access_token: "CODIGOMERCADOPAGOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO" // ← Reemplazá esto con tu token real
});

// 🚀 Función para crear la preferencia de pago
exports.crearPreferencia = onRequest(async (req, res) => {
  const carrito = req.body.carrito;

  const items = carrito.map(p => ({
    title: p.nombre,
    quantity: 1,
    unit_price: p.precio,
    currency_id: "ARS"
  }));

  const preference = {
    items,
    back_urls: {
      success: "https://miappvendible.web.app/views/success.html",
      failure: "https://miappvendible.web.app/views/failure.html",
      pending: "https://miappvendible.web.app/views/pending.html"
    },
    auto_return: "approved"
  };

  try {
    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body.id });
  } catch (error) {
    logger.error("Error al crear preferencia:", error);
    res.status(500).send("Error al crear preferencia");
  }
});
