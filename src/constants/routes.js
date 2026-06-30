const Home = () => <h1>Home Page</h1>;

const AdminDashboard = () => <h1>Admin Dashboard</h1>;

const UserDashboard = () => <h1>User Dashboard</h1>;

export const landingRoutes = [
  {
    path: "/",
    element: Home,
  },
];



export const adminRoutes = [
  {
    path: "",
    element: AdminDashboard,
  },
];


export const userRoutes = [
  {
    path: "",
    element: UserDashboard,
  },
];