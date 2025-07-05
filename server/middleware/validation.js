const Joi = require('joi');

const validateHotel = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(10).max(2000).required(),
    shortDescription: Joi.string().max(200),
    location: Joi.object({
      address: Joi.string().required(),
      area: Joi.string().valid(
        'Sitabuldi', 'Sadar', 'Dharampeth', 'Civil Lines', 'Ramdaspeth',
        'Mahal', 'Gandhibagh', 'Itwari', 'Kamptee Road', 'Wardha Road',
        'Amravati Road', 'Katol Road', 'Seminary Hills', 'Hingna Road',
        'Koradi Road', 'Manish Nagar', 'Pratap Nagar', 'Trimurti Nagar'
      ).required(),
      coordinates: Joi.object({
        latitude: Joi.number().min(21.0).max(21.3).required(),
        longitude: Joi.number().min(78.8).max(79.3).required()
      }).required(),
      nearbyLandmarks: Joi.array().items(Joi.string())
    }).required(),
    images: Joi.array().items(
      Joi.object({
        url: Joi.string().uri().required(),
        caption: Joi.string(),
        isPrimary: Joi.boolean()
      })
    ).min(1).required(),
    amenities: Joi.array().items(Joi.string()).min(1).required(),
    roomTypes: Joi.array().items(
      Joi.object({
        type: Joi.string().valid('Standard', 'Deluxe', 'Suite', 'Executive', 'Presidential').required(),
        price: Joi.number().min(500).required(),
        capacity: Joi.object({
          adults: Joi.number().min(1).default(2),
          children: Joi.number().min(0).default(1)
        }),
        amenities: Joi.array().items(Joi.string()),
        totalRooms: Joi.number().min(1).required(),
        availableRooms: Joi.number().min(0).required(),
        images: Joi.array().items(Joi.string().uri())
      })
    ).min(1).required(),
    contact: Joi.object({
      phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
      email: Joi.string().email().required(),
      website: Joi.string().uri()
    }).required(),
    policies: Joi.object({
      checkIn: Joi.string().default('14:00'),
      checkOut: Joi.string().default('11:00'),
      cancellation: Joi.string(),
      petPolicy: Joi.string(),
      smokingPolicy: Joi.string().default('No Smoking')
    })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      message: 'Validation error', 
      details: error.details[0].message 
    });
  }
  next();
};

const validateBooking = (req, res, next) => {
  const schema = Joi.object({
    hotelId: Joi.string().required(),
    roomType: Joi.string().valid('Standard', 'Deluxe', 'Suite', 'Executive', 'Presidential').required(),
    checkIn: Joi.date().min('now').required(),
    checkOut: Joi.date().greater(Joi.ref('checkIn')).required(),
    guests: Joi.object({
      adults: Joi.number().min(1).required(),
      children: Joi.number().min(0).default(0)
    }).required(),
    guestDetails: Joi.object({
      name: Joi.string().min(2).required(),
      phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
      email: Joi.string().email().required(),
      idType: Joi.string().valid('aadhar', 'pan', 'passport', 'driving_license'),
      idNumber: Joi.string()
    }).required(),
    specialRequests: Joi.string().max(500)
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      message: 'Validation error', 
      details: error.details[0].message 
    });
  }
  next();
};

const validateUser = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
    role: Joi.string().valid('user', 'hotelOwner').default('user')
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      message: 'Validation error', 
      details: error.details[0].message 
    });
  }
  next();
};

module.exports = {
  validateHotel,
  validateBooking,
  validateUser
};