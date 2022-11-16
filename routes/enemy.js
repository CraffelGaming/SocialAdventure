import express from 'express';
const endpoint = 'enemy';
const router = express.Router();
router.get('/' + endpoint, (request, response) => {
    response.render(endpoint, {
        title: 'Social Adventure'
    });
});
export default router;
//# sourceMappingURL=enemy.js.map