import {runDb} from "./repositories/db";
import {app, port} from "./appconfig";

const appStart = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
})
}

appStart()
