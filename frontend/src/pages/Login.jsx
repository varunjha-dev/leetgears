import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router'; 
import { loginUser } from "../authSlice";
import { useEffect, useState } from 'react';
import { Eye, EyeOff, BrainCircuit } from 'lucide-react';

const loginSchema = z.object({
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password is too weak") 
});

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) }); // Using renamed schema

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#282828] text-white">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body bg-[#282828] rounded-2xl">
          <h2 className="card-title justify-center text-3xl mb-6">
            <BrainCircuit size={30} className="text-green-500 mr-2" /> 
            <span className="text-white">LeetGears</span>
          </h2>

          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control"> {/* Removed mt-4 from first form-control for tighter spacing to title or global error */}
              <label className="label"> {/* Removed mb-1, default spacing should be fine */}
                <span className="label-text text-white">Email</span>
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                className={`input input-bordered w-full ${errors.emailId ? 'input-error' : ''} bg-gray-700 text-white border-gray-600`}
                {...register('emailId')}
              />
              {errors.emailId && (
                <span className="text-error text-sm mt-1">{errors.emailId.message}</span>
              )}
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text text-white">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`input input-bordered w-full pr-10 ${errors.password ? 'input-error' : ''} bg-gray-700 text-white border-gray-600`}
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-error text-sm mt-1">{errors.password.message}</span>
              )}
            </div>

            <div className="form-control mt-8 flex justify-center">
              <button
                type="submit"
                className={`btn bg-[#00A68A] hover:bg-[#008F77] border-none text-white ${loading ? 'loading btn-disabled' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Logging in...
                  </>
                ) : 'Login'}
              </button>
            </div>
          </form>
          <div className="text-center mt-6">
            <span className="text-sm text-gray-300">
              Don't have an account?{' '}
              <NavLink to="/signup" className="link text-green-400 hover:text-green-300">
                Sign Up
              </NavLink>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;