import afetch from 'afetch'
import { XMLParser, XMLBuilder } from 'fast-xml-parser'

const { parse } = new XMLParser()
const { build } = new XMLBuilder()

const client = afetch({
  xml: {
    parse,
    build,
  },
})
