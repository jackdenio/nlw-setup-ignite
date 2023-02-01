import WebPush from 'web-push'
import { FastifyInstance } from "fastify"
import { z } from "zod"

const publicKey = 'BL6UDPrSUr_r4hN8Ks9OTxKCX6VXJBpPuLjiIYZ6HQUVPBtrzOOWanru-njPhiozOun1AIHk4u4jAYpUryy66aA'
const privateKey = '7Vfyzjrup0ZcvrwXO0uyPETAOiCm_sUk7EJVLKpLhcA'

WebPush.setVapidDetails(
  'http://localhost:3333',
  publicKey,
  privateKey
)


export async function notificationsRoutes(app: FastifyInstance) {

  app.get('/push/public_key', () => {
    return {
      publicKey,
    }
  })

  app.post('/push/register', (request, reply) => {
    console.log(request.body)

    return reply.status(201).send()
  })

  app.post('/push/send', (request, reply) => {
    const sendPushBody = z.object({
      subscription: z.object({
        endpoint: z.string(),
        keys: z.object({
          p256dh: z.string(),
          auth: z.string()
        })
      })
    })

    const { subscription } = sendPushBody.parse(request.body)

    setTimeout(() => {
      WebPush.sendNotification(subscription, 'hi there from backend')
    }, 5000)

    return reply.status(201).send()
  })



  
}

