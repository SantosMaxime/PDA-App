import * as React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Box,
    Typography,
} from "@mui/material";

export default function DeleteAlertDialog({
    isOpen,
    handleClose,
    title = "Confirmation",
    description = "Êtes-vous sûr de vouloir continuer ?",
    onConfirm,
    selectedIds,
}) {
    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {description}
                </DialogContentText>
                <Box mt={2}>
                    <Typography variant="subtitle1" gutterBottom>
                        IDs sélectionné(s):
                    </Typography>
                    {selectedIds.size > 0 ? (
                        <Typography variant="body2">
                            {Array.from(selectedIds).join(", ")}
                        </Typography>
                    ) : (
                        <Typography variant="body2" color="textSecondary">
                            Aucune rangée sélectionnée.
                        </Typography>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Annuler</Button>
                <Button onClick={onConfirm} color="primary" autoFocus>
                    Confirmer
                </Button>
            </DialogActions>
        </Dialog>
    );
}
