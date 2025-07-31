import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import zxcvbn from 'zxcvbn';

const Profile = () => {
  const { token, backendUrl } = useContext(ShopContext);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ name: '', email: '', deliveryAddress: '' });
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', deliveryAddress: '' });
  const [password, setPassword] = useState('');
  const [passwordScore, setPasswordScore] = useState(0);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [requirements, setRequirements] = useState({ length: false, upper: false, lower: false, number: false, special: false });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(backendUrl + '/api/user/profile', { headers: { token } });
        if (res.data.success) {
          setProfile(res.data.user);
          setForm({
            name: res.data.user.name || '',
            email: res.data.user.email || '',
            deliveryAddress: res.data.user.deliveryAddress?.address || '',
          });
        } else {
          toast.error(res.data.message);
        }
      } catch (err) {
        toast.error('Failed to fetch profile.');
      }
      setLoading(false);
    };
    fetchProfile();
  }, [backendUrl, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    setPasswordTouched(true);
    const result = zxcvbn(val);
    setPasswordScore(result.score);
    setRequirements({
      length: val.length >= 8,
      upper: /[A-Z]/.test(val),
      lower: /[a-z]/.test(val),
      number: /[0-9]/.test(val),
      special: /[^A-Za-z0-9]/.test(val),
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (password) payload.password = password;
      const res = await axios.put(backendUrl + '/api/user/profile', payload, { headers: { token } });
      if (res.data.success) {
        toast.success('Profile updated successfully!');
        setEdit(false);
        setPassword('');
        setPasswordTouched(false);
        setPasswordScore(0);
        setRequirements({ length: false, upper: false, lower: false, number: false, special: false });
        // Refresh profile
        setProfile({ ...profile, ...form });
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Failed to update profile.');
    }
    setLoading(false);
  };

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]">Loading...</div>;

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">My Profile</h2>
      {!edit ? (
        <div>
          <div className="mb-4">
            <div className="text-gray-700 font-medium">Name:</div>
            <div>{profile.name}</div>
          </div>
          <div className="mb-4">
            <div className="text-gray-700 font-medium">Email:</div>
            <div>{profile.email}</div>
          </div>
          <div className="mb-4">
            <div className="text-gray-700 font-medium">Address:</div>
            <div>{profile.deliveryAddress?.address || ''}</div>
          </div>
          <button className="bg-[#8B0000] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#B22222]" onClick={() => setEdit(true)}>Edit Profile</button>
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleUpdate}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input type="text" name="deliveryAddress" value={form.deliveryAddress} onChange={handleChange} className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Change Password</label>
            <input type="password" name="password" value={password} onChange={handlePasswordChange} onBlur={() => setPasswordTouched(true)} className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Enter new password" />
            {/* Password Strength Meter & Requirements */}
            {passwordTouched && password && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-2 rounded bg-gray-200 overflow-hidden">
                    <div className={`h-2 rounded transition-all duration-300 ${
                      passwordScore === 0 ? 'bg-red-400 w-1/4' :
                      passwordScore === 1 ? 'bg-orange-400 w-1/3' :
                      passwordScore === 2 ? 'bg-yellow-400 w-2/3' :
                      passwordScore === 3 ? 'bg-green-400 w-3/4' :
                      'bg-green-600 w-full'
                    }`} />
                  </div>
                  <span className={`text-xs font-semibold ${
                    passwordScore === 0 ? 'text-red-500' :
                    passwordScore === 1 ? 'text-orange-500' :
                    passwordScore === 2 ? 'text-yellow-600' :
                    passwordScore === 3 ? 'text-green-600' :
                    'text-green-800'
                  }`}>
                    {['Weak', 'Weak', 'Fair', 'Good', 'Strong'][passwordScore]}
                  </span>
                </div>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li className={requirements.length ? 'text-green-600' : 'text-red-500'}>• At least 8 characters</li>
                  <li className={requirements.upper ? 'text-green-600' : 'text-red-500'}>• At least one uppercase letter</li>
                  <li className={requirements.lower ? 'text-green-600' : 'text-red-500'}>• At least one lowercase letter</li>
                  <li className={requirements.number ? 'text-green-600' : 'text-red-500'}>• At least one number</li>
                  <li className={requirements.special ? 'text-green-600' : 'text-red-500'}>• At least one special character</li>
                </ul>
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <button type="submit" className="bg-[#8B0000] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#B22222]">Save</button>
            <button type="button" className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium" onClick={() => setEdit(false)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile; 