import webapp2
import logging

class GeoLocation(webapp2.RequestHandler):
    def get(self):
        ip = self.request.remote_addr

        if ip == "127.0.0.1":
            countryCode = "gb"
        else:
            countryCode = self.request.headers['X-AppEngine-country']

        logging.info("IP is '%s', country code is %s" % (ip, countryCode))

        if self.request.get("callback"): # JSONP Request
            self.response.headers['Content-Type'] = 'text/javascript'
            self.response.out.write(self.request.get("callback") + "('")
            self.response.out.write(countryCode)
            self.response.out.write("')")
        else:
            self.response.headers['Content-Type'] = 'text/plain'
            self.response.out.write(countryCode)


app = webapp2.WSGIApplication([('/geo-location', GeoLocation)], debug=True)
