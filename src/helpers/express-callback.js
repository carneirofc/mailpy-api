/** Interface Express passing a custom http request to the injected controller */
export default function makeExpressCallback(controller) {
  return (req, res) => {
    const httpRequest = {
      body: req.body,
      query: req.query,
      params: req.params,
      ip: req.ip,
      method: req.method,
      path: req.path,
      headers: {
        "Content-Type": req.get("Content-Type"),
        "User-Agent": req.get("User-Agent"),
        Referer: req.get("referer"),
        Authorization: req.get("authorization")
      }
    };

    controller(httpRequest)
      .then(httpResponse => {
        /** Receive the response from the controller and send it through express */
        if (httpResponse) {
          res.set(httpResponse.headers);
        }
        res.type("json");
        res.status(httpResponse.statusCode);
        res.send(httpResponse.body);
      })
      .catch(e => {
        res.status(500);
        res.send({ error: "An unknow error ocurred" });
        console.error(`Unknown error ${e}`, e)
      });
  }
}