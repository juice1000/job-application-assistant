import { Modal, Box, Typography, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FlagIcon from '@mui/icons-material/Flag';
import { Job, writeApplication, updateJobStatus } from '../libs/api';
import { getStatusColor } from './DashboardHelper';
import CircularProgress from '@mui/material/CircularProgress';

interface JobDetailModalProps {
  open: boolean;
  onClose: () => void;
  job: Job | undefined;
  onUpdate: () => void; // Add this to refresh the job list after update
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  height: '90%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  overflow: 'auto',
  borderRadius: '8px',
};

const JobDetailModal = ({ open, onClose, job, onUpdate, loading, setLoading }: JobDetailModalProps) => {
  const handleFlagToggle = async (newStatus: 'pending' | 'applied' | 'rejected' | 'irrelevant' | 'review' | 'ready') => {
    if (!job) return;
    try {
      await updateJobStatus(job.id, newStatus);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating job status:', error);
    }
  };
  const handleWriteApplication = async () => {
    if (!job) return;
    setLoading(true);
    await writeApplication(job.id);
    onUpdate();
  };

  if (!job) return null;
  const isIrrelevant = job.status === 'irrelevant';
  const underReview = job.status === 'review';

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h3" component="h2" gutterBottom>
          {job.title}
        </Typography>

        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <Typography
            sx={{ backgroundColor: getStatusColor(job.status), width: 'fit-content', paddingY: 1, paddingX: 2, borderRadius: '50px', fontWeight: 'bold' }}
            color="text.secondary"
            variant="subtitle1"
          >
            {job.status}
          </Typography>
          <Typography variant="subtitle1" sx={{ width: 'fit-content', paddingY: 1, paddingX: 2, borderRadius: '50px', fontWeight: 'bold' }}>
            {job.language}
          </Typography>
          {job.dateApplied && (
            <Typography sx={{ width: 'fit-content', paddingY: 1, paddingX: 2, borderRadius: '20px', fontWeight: 'bold', border: 'solid' }} variant="subtitle1">
              Date Applied: {job.dateApplied || 'Not applied'}
            </Typography>
          )}
        </Box>

        <Typography variant="h6" gutterBottom>
          Keywords
        </Typography>
        <Typography>{job.keywords}</Typography>
        <br />
        <hr />
        <br />
        <Typography variant="h6" gutterBottom>
          Description
        </Typography>
        <Typography style={{ whiteSpace: 'pre-wrap' }}>{job.description}</Typography>
        <br />
        <hr className="border" />
        <br />
        {job.applicationLetter && (
          <>
            <Typography variant="h6" gutterBottom>
              Application Letter
            </Typography>
            {loading ? <CircularProgress /> : <Typography style={{ whiteSpace: 'pre-wrap' }}>{job.applicationLetter || 'No application letter'}</Typography>}
          </>
        )}

        <Box
          sx={{
            position: 'sticky',
            bottom: 0,
            pb: 2,
            pt: 2,
            mt: 4,
            borderTop: '1px solid #e0e0e0',
            backgroundColor: 'background.paper',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
          }}
        >
          <Button disabled={loading} variant="outlined" color="secondary" onClick={handleWriteApplication} sx={{ borderRadius: '50px', fontWeight: 'bold' }}>
            {job.applicationLetter ? 'Rewrite Application' : 'Write Application'}
          </Button>
          <Button
            disabled={loading}
            variant="outlined"
            color={isIrrelevant ? 'success' : 'warning'}
            onClick={() => handleFlagToggle(isIrrelevant ? 'pending' : 'irrelevant')}
            startIcon={<FlagIcon />}
            sx={{ borderRadius: '50px', fontWeight: 'bold' }}
          >
            {isIrrelevant ? 'Mark Relevant' : 'Mark Irrelevant'}
          </Button>
          {job.applicationLetter && (
            <Button
              disabled={loading}
              variant="outlined"
              color={underReview ? 'primary' : 'secondary'}
              onClick={() => handleFlagToggle(underReview ? 'ready' : 'review')}
              sx={{ borderRadius: '50px', fontWeight: 'bold' }}
            >
              {underReview ? 'Mark Safe' : 'Mark Under Review'}
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default JobDetailModal;
