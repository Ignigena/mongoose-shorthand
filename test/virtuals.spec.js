const mongoose = require('mongoose')
const model = require('../')()

const User = model('User', {
  schema: {
    email: String,
    firstName: String,
    lastName: String
  },
  virtuals: {
    fullName () {
      return `${this.firstName} ${this.lastName}`
    }
  }
})

describe('virtuals', () => {
  let record
  let fixture = {
    email: 'test@test.com',
    firstName: 'Test',
    lastName: 'User'
  }

  beforeAll(async () => {
    mongoose.connect(process.env.DB_MONGO || 'mongodb://127.0.0.1:27017/test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    record = await User.create(fixture)
  })

  afterAll(() => mongoose.connection.close())

  it('properly configures any virtual fields', () => {
    expect(record.fullName).toEqual('Test User')
  })
})
