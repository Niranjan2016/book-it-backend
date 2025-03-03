/**
 * @swagger
 * tags:
 *   name: Seats
 *   description: Seat management and booking
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Seat:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         number:
 *           type: integer
 *         status:
 *           type: string
 *         category:
 *           type: string
 *         price:
 *           type: number
 */

/**
 * @swagger
 * /events/{eventId}/show-times/{showTimeId}:
 *   get:
 *     summary: Get seat layout for a specific showtime
 *     tags: [Seats]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event ID
 *       - in: path
 *         name: showTimeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Show Time ID
 *     responses:
 *       200:
 *         description: Seat layout retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 eventId:
 *                   type: integer
 *                 showTimeId:
 *                   type: integer
 *                 layout:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Seat'
 *                 availableSeats:
 *                   type: integer
 */

/**
 * @swagger
 * /screens/{screenId}/generate:
 *   post:
 *     summary: Generate seats for a screen
 *     tags: [Seats]
 *     parameters:
 *       - in: path
 *         name: screenId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Screen ID
 *     responses:
 *       201:
 *         description: Seats generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 seatCount:
 *                   type: integer
 *                 layout:
 *                   type: object
 *                   properties:
 *                     rows:
 *                       type: integer
 *                     seatsPerRow:
 *                       type: integer
 *                     totalSeats:
 *                       type: integer
 */

/**
 * @swagger
 * /screens/{screenId}/layout:
 *   get:
 *     summary: Get seat layout for a screen
 *     tags: [Seats]
 *     parameters:
 *       - in: path
 *         name: screenId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Screen ID
 *     responses:
 *       200:
 *         description: Screen layout retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 screenId:
 *                   type: integer
 *                 layout:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Seat'
 *                 totalSeats:
 *                   type: integer
 */