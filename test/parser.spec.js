const shorthand = require('../')

describe('parser', () => {
  const model = shorthand({ foo: 'bar' })

  it('passes along context to model', () => {
    const cb = jest.fn().mockReturnValue({ schema: { email: String } })
    model('User', cb)
    expect(cb).toHaveBeenCalled()
    expect(cb.mock.calls.pop()[0].foo).toBe('bar')
  })

  it('includes a parser for subdocuments and nested schemas', () => {
    const cart = model('Cart', (config, makeSchema) => ({
      schema: {
        items: [makeSchema({ schema: { quantity: Number } })],
        coupon: String
      }
    }))

    expect(cart.schema.childSchemas.length).toBe(1)
  })
})
