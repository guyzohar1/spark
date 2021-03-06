var log = require('../libs/logger')(module);
const Event = require('../models/event').Event
const userRole = require('../libs/user_role');

var createEvent = function(req) {
    log.debug('Saving event ' + req.body);
    return req.body;
}

module.exports = (app, passport) => {

    app.get('/events', (req, res) => {
        Event.fetchAll()
        .then((events) => {
            res.status(200).json(
                { 
                    events: events.toJSON()
                }
            )
        })
        .catch((err) => {
            res.status(500).json({
                error: true,
                data: {
                    message: err.message
                }
            });
        });
    });

    app.post('/events/new', 
        [userRole.isLoggedIn(), userRole.isAllowNewCamp()],
        (req, res) => {
            Event.forge(createEvent(req)).save()
            .then(res.send(200))
            .catch((e) => {
                res.status(500).json({
                    error: true,
                    data: {
                        message: e.message
                    }
                });
            });
        }); 

    app.get('/events/:event_id',
        [userRole.isLoggedIn()],
        (req, res) => {
            var event_id = req.params.event_id;
            Event.forge({ event_id: event_id }).fetch().then((event) => {
                let props = {};
                if (typeof event.attributes.json_data === 'string') {
                    props = JSON.parse(event.attributes.json_data);
                }
                for (var prop in props) { events.attributes[prop] = props[prop]; }
                console.log(event);
                res.json({ event: event });
            });    
        });

    app.put('/events/:event/edit', 
        userRole.isLoggedIn(),
        (req, res) => {
            log.debug('EventsAPI edit ' + _.get(req, 'params.event'));
        });

}
