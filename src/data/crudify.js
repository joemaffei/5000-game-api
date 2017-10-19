import db from './database'


const crudify = (collection) => (
  {
    create: async (record) => {
      let snap = await db.ref(collection).push(record)
      return snap.key
    },

    read: async (id) => {
      let snap = await db.ref(`${collection}/${id}`).once('value')
      return snap.val()
    },

    update: async (id, record) => {
      let updates = {}
      updates[`${collection}/${id}`] = record
      let snap = await db.ref().update(updates)
      return true
    },

    delete: async (id) => {
      await db.ref(`${collection}/${id}`).remove()
      return true
    }
  }
)


export default crudify