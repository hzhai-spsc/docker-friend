const AWS = require('../awsCredentials')

module.exports = [{
    method: 'GET',
    path: '/aws/profiles',
    handler: function(request, reply) {
      reply(AWS.getProfileNames())
    }
  }, {
    method: 'POST',
    path: '/aws/submitmfa',
    handler: async (request, reply) => {
      let profile = await AWS.setProfile(request.payload.profile).catch((err) => {
        return reply({err: true, msg: err})

      })
      // set profile
      let authed = await AWS.mfaAuth(request.payload.mfa).catch((err) => {
        return reply({err: true, msg: err.message})

      })
      reply(authed)

    }
  }, {
    method: 'POST',
    path: '/aws/assumerole',
    handler: function(request, reply) {
      AWS.authContainer().then(function(res) {
        reply(res)
      }).catch(function(err) {reply(err)})
    }
  }, {
    method: 'GET',
    path: '/latest/meta-data/iam/security-credentials/',
    handler: function(request, reply) {
      AWS.getContainerRoleNameByIp(request.info.remoteAddress, function(res) {
        reply(res)
      })
    }
  }, {
    method: 'GET',
    path: '/latest/meta-data/iam/security-credentials/{role}',
    handler: function(request, reply) {
      AWS.containerRoleRequest(request.info.remoteAddress, function(err, res) {
        reply(res)
      })
    }
  }]
