import mongoose from 'mongoose'

const InitiateMongoServer = async (user: string | undefined, password: string | undefined, path: string | undefined) => {
    const dbURI = `mongodb+srv://${user}:${password}@${path}`
    try {
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    } catch (err) {
        throw err
    }
}

export default InitiateMongoServer