import createExpressInstance from './createExpressInstance.js'

const startApp = async () => {
    const app = createExpressInstance()

    try {
        await app.listen(Number(process.env.APP_PORT));
        console.log(`Server running on port ${process.env.APP_PORT}`)
    } catch (error) {
        app.log.error(error)
        process.exit(1)
    }

    return app;
}

export default startApp;