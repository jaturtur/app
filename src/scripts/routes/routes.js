import AboutPage from '../pages/about/about-page';
import StoriesPage from '../pages/stories/stories-page';
import StoryDetailPage from '../pages/story-detail/story-detail-page';
import AddStoryPage from '../pages/add-story/add-story-page';
import LoginPage from '../pages/login/login-page';
import RegisterPage from '../pages/register-page';

const routes = {
  '/': new StoriesPage(),
  '/stories/:id': new StoryDetailPage(),
  '/add': new AddStoryPage(),
  '/login': new LoginPage(),
  '/register': new RegisterPage(),
  '/about': new AboutPage(),
};

export default routes;