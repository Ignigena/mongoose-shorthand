const mongoose = require('mongoose')
const model = require('../')()

const User = model('User', {
  schema: {
    email: String,
    password: String
  },
  middleware: {
    preSave (next) {
      if (!this.isModified('password')) return next()
      this.password = this.password.split('').reverse().join('')
      next()
    }
  }
})

describe('virtuals', () => {
  let record
  let fixture = {
    email: 'test@test.com',
    password: 'password'
  }

  beforeAll(async () => {
    mongoose.connect(process.env.DB_MONGO || 'mongodb://127.0.0.1:27017/test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    record = await User.create(fixture)
  })

  afterAll(() => mongoose.connection.close())

  it('implements all middleware specified in the model', async () => {
    expect(record.password).toEqual('drowssap')
    record.email = 'changed@test.com'
    record = await record.save()
    expect(record.password).toEqual('drowssap')
  })
})
