/**
 * @swagger
 * components:
 *   schemas:
 *     Screen:
 *       type: object
 *       properties:
 *         screen_id:
 *           type: integer
 *         name:
 *           type: string
 *         capacity:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [active, maintenance, inactive]
 *
 *     Venue:
 *       type: object
 *       properties:
 *         venue_id:
 *           type: integer
 *         name:
 *           type: string
 *         address:
 *           type: string
 *         capacity:
 *           type: integer
 *         description:
 *           type: string
 *         image_url:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         screens:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Screen'
 */

/**
 * @swagger
 * tags:
 *   name: Venues
 *   description: Venue management endpoints
 */

/**
 * @swagger
 * /api/venues:
 *   get:
 *     summary: Get all venues
 *     tags: [Venues]
 *     responses:
 *       200:
 *         description: List of venues retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Venue'
 *   
 *   post:
 *     summary: Create a new venue
 *     tags: [Venues]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               screens:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     capacity:
 *                       type: integer
 *                     rows:
 *                       type: integer
 *                     seats_per_row:
 *                       type: integer
 *                     base_price:
 *                       type: number
 *     responses:
 *       201:
 *         description: Venue created successfully
 *
 * /api/venues/{id}:
 *   get:
 *     summary: Get venue by ID
 *     tags: [Venues]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Venue details retrieved successfully
 *       404:
 *         description: Venue not found
 *
 *   put:
 *     summary: Update venue
 *     tags: [Venues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Venue updated successfully
 *       404:
 *         description: Venue not found
 *
 *   delete:
 *     summary: Delete venue
 *     tags: [Venues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Venue deleted successfully
 *       404:
 *         description: Venue not found
 *
 * /api/venues/{id}/screens:
 *   get:
 *     summary: Get screens for a venue
 *     tags: [Venues]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of screens for the venue
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Screen'
 *
 * /api/venues/admin:
 *   get:
 *     summary: Get venues for logged-in admin
 *     tags: [Venues]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of venues for the admin
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 */