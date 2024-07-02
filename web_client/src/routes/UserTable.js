import React, { useEffect, useState, useMemo, Fragment } from "react";
import { useSnackbar } from "notistack";
import {
    Grid,
    Button,
    IconButton,
    TextField,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
} from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import "../css/UserTable.css";
import Header from "../components/Header";
import { getUsers, addUser, updateUser, removeUsers } from "../api/Users";
import {
    validateColumnSizes,
    applySavedColumnSizes,
} from "../utils/columnSizeUtils";
import DeleteAlertDialog from "../components/AlertDialog";
import { validateEmail } from "../utils/validations";
import { useUser } from "../context/UserContext";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import DismissIcon from "@mui/icons-material/Close";
import CopyIcon from "@mui/icons-material/FileCopyOutlined";

function UserTable() {
    const roleList = ["Admin", "User"];
    const [selectedRole, setSelectedRole] = React.useState(roleList[0]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isNameValid, setIsNameValid] = useState(true);
    const [isRoleValid, setIsRoleValid] = useState(true);

    const [users, setUsers] = useState([]);
    const [isInEditMode, setIsInEditMode] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedUserIDs, setSelectedUserIDs] = useState([]);
    const [selectionModel, setSelectionModel] = React.useState([]);
    const [loading, setLoading] = useState(false);

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const { user } = useUser();

    const defaultColumns = useMemo(
        () => [
            { field: "id", headerName: "ID", width: 70 },
            { field: "name", headerName: "Nom", width: 130 },
            { field: "email", headerName: "Email", width: 130 },
            { field: "role", headerName: "Rôle", width: 90 },
            { field: "createdAt", headerName: "Crée le", width: 130 },
            { field: "updatedAt", headerName: "Modifié le", width: 130 },
        ],
        [],
    ); // Empty dependency array ensures this only runs once

    const rows = users.map((user) => ({
        ...user,
        createdAt: user.createdAt
            ? new Date(user.createdAt).toLocaleString()
            : "",
        updatedAt: user.updatedAt
            ? new Date(user.updatedAt).toLocaleString()
            : "",
    }));

    useEffect(() => {
        if (email === "") {
            setIsEmailValid(true);
        } else {
            const isEmailValid = validateEmail(email);
            setIsEmailValid(isEmailValid);
        }
    }, [email]);

    useEffect(() => {
        fetchUsers();
        validateColumnSizes(defaultColumns);
    }, [defaultColumns]);

    const handleDeleteClickOpen = (selectedIDs) => {
        if (selectedIDs.size < 1) {
            enqueueSnackbar("Please select a user to delete", {
                variant: "error",
                autoHideDuration: 2000,
            });
            return;
        }
        setSelectedUserIDs(selectedIDs);
        setDialogOpen(true);
    };
    const handleDialogClose = () => {
        setDialogOpen(false);
    };
    const handleDeleteConfirm = () => {
        setLoading(true);
        setDialogOpen(false);
        removeUsers(selectedUserIDs)
            .then(() => {
                setUsers(users.filter((user) => !selectedUserIDs.has(user.id)));
                setLoading(false);
                handleClickVariant("success", "delete")();
            })
            .catch((error) => console.error("Delete error:", error));
    };

    const fetchUsers = () => {
        setLoading(true);
        getUsers()
            .then((UserList) => {
                setUsers(UserList);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                console.error("Fetch error:", error);
            });
    };

    const columns = applySavedColumnSizes(defaultColumns);

    const handleColumnResize = (params) => {
        const newWidth = params.width;
        const field = params.field || params.colDef?.field;

        if (field) {
            const currentSizes = JSON.parse(
                localStorage.getItem("columnSizes") || "{}",
            );
            const newSizes = { ...currentSizes, [field]: newWidth };
            localStorage.setItem("columnSizes", JSON.stringify(newSizes));
        }
    };

    const validateFormValues = (values) => {
        const { name, email, role } = values;
        const isNameValid = name && name.trim().length > 0;
        const isEmailValid = validateEmail(email);
        const isRoleValid = role && role.trim().length > 0;

        setIsNameValid(isNameValid);
        setIsEmailValid(isEmailValid);
        setIsRoleValid(isRoleValid);

        if (users.map((user) => user.email).includes(email)) {
            enqueueSnackbar("User with this email already exists", {
                variant: "error",
                autoHideDuration: 2000,
            });
            return false;
        }

        const invalidCount = [isNameValid, isEmailValid, isRoleValid].filter(
            (isValid) => !isValid,
        ).length;

        if (invalidCount >= 2) {
            enqueueSnackbar(
                "Plusieurs champs sont invalides. Vérifier les champs et réessayez.",
                {
                    variant: "error",
                    autoHideDuration: 4000,
                },
            );
        } else {
            // Handle individual errors if only one field is invalid
            if (!isNameValid) {
                enqueueSnackbar("Le nom n'est pas valide", {
                    variant: "error",
                    autoHideDuration: 2000,
                });
            }
            if (!isEmailValid) {
                enqueueSnackbar("L'email n'est pas valide", {
                    variant: "error",
                    autoHideDuration: 2000,
                });
            }
            if (!isRoleValid) {
                enqueueSnackbar("Le rôle n'est pas valide", {
                    variant: "error",
                    autoHideDuration: 2000,
                });
            }
        }

        return isNameValid && isEmailValid && isRoleValid;
    };

    const getActions = (params) => {
        if (user && params.row.email === user.email) {
            // If it's the logged-in user, return no action items or disabled items
            return [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit"
                    disabled={true}
                    tooltip="You cannot edit yourself here."
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    disabled={true}
                    tooltip="You cannot delete yourself."
                />,
            ];
        } else {
            return [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit"
                    disabled={true}
                    onClick={() => setIsInEditMode(true)}
                    color="primary"
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={() => {
                        const selectedIDs = new Set([params.id]);
                        handleDeleteClickOpen(selectedIDs);
                    }}
                    color="error"
                />,
            ];
        }
    };

    const addUserSnackbar = (randomPassword) => {
        handleClickVariant("success", "add")();
        enqueueSnackbar("Nouveau mot de passe crée: " + randomPassword, {
            variant: "info",
            autoHideDuration: 10000, // Snackbar will auto-hide after 10 seconds
            action: (key) => (
                <div>
                    <IconButton
                        aria-label="copy"
                        size="small"
                        color="inherit"
                        onClick={() => {
                            navigator.clipboard
                                .writeText(randomPassword)
                                .then(() =>
                                    enqueueSnackbar("Mot de passe copié", {
                                        variant: "success",
                                    }),
                                );
                        }}
                    >
                        <CopyIcon />
                    </IconButton>
                    <IconButton
                        aria-label="dismiss"
                        size="small"
                        color="inherit"
                        onClick={() => closeSnackbar(key)}
                    >
                        <DismissIcon />
                    </IconButton>
                </div>
            ),
        });
    };

    function generateStrongPassword(length = 12) {
        const charset =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
        let password = "";
        for (let i = 0, n = charset.length; i < length; ++i) {
            password += charset.charAt(Math.floor(Math.random() * n));
        }
        return password;
    }

    const handleAddClick = () => {
        const randomPassword = generateStrongPassword(10);

        if (!validateFormValues({ name, email, role: selectedRole })) {
            return;
        }

        const newUser = {
            name: name,
            email: email.toLowerCase(),
            password: randomPassword,
            role: selectedRole,
        };

        addUser(newUser)
            .then((data) => {
                setUsers((currentUsers) => [
                    ...currentUsers,
                    data.user ? data.user : data,
                ]);
                addUserSnackbar(randomPassword);
            })
            .catch((error) => {
                handleClickVariant("error", "add")();
                console.error("Add error:", error);
            });
    };

    const handleClickVariant = (variant, type) => () => {
        // variant could be success, error, warning, info, or default
        if (type === "delete") {
            if (variant === "success") {
                enqueueSnackbar("Utilisateur supprimé", { variant });
            } else {
                enqueueSnackbar("Erreur lors de la suppression", { variant });
            }
        } else if (type === "add") {
            if (variant === "success") {
                enqueueSnackbar("Utilisateur ajouté", { variant });
            } else {
                enqueueSnackbar("Erreur lors de la suppression", { variant });
            }
        } else if (type === "edit") {
            if (variant === "success") {
                enqueueSnackbar("Utilisateur modifié", { variant });
            } else {
                enqueueSnackbar("Erreur lors de la suppression", { variant });
            }
        } else {
            if (variant === "success") {
                enqueueSnackbar("Success message", { variant });
            } else {
                enqueueSnackbar("Error message", { variant });
            }
        }
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
        const isNameValid = name && name.trim().length > 0;
        setIsNameValid(isNameValid);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleChangeSelection = (event) => {
        setSelectedRole(event.target.value);
        const isRoleValid = selectedRole && selectedRole.trim().length > 0;
        setIsRoleValid(isRoleValid);
    };

    const handleRowSelectionChange = (ids) => {
        if (user) {
            // Exclude the logged-in user's ID from selection
            const filteredIds = ids.filter((id) => id !== user.id);
            setSelectionModel(filteredIds);
        } else {
            setSelectionModel(ids);
        }
    };

    // if there is no actions column, add it
    if (!columns.find((col) => col.field === "actions")) {
        columns.push({
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 100,
            getActions: (params) => {
                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            disabled={true}
                            className="textPrimary"
                            onClick={() => {
                                updateUser(params.id, params.row)
                                    .then(() => {
                                        setIsInEditMode(false);
                                        setUsers(
                                            users.map((user) =>
                                                user.id === params.id
                                                    ? params.row
                                                    : user,
                                            ),
                                        );
                                    })
                                    .catch(console.error);
                            }}
                            color="inherit"
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon style={{ color: "red" }} />}
                            label="Cancel"
                            onClick={() => setIsInEditMode(false)}
                            color="inherit"
                        />,
                    ];
                } else {
                    return getActions(params);
                }
            },
        });
    }

    if (!columns.find((col) => col.field === "delete")) {
        columns.push({
            field: "delete",
            type: "delete",
            width: 60,
            sortable: false,
            disableColumnMenu: true,
            renderHeader: () => {
                return (
                    <IconButton
                        onClick={() => {
                            const selectedIDs = new Set(selectionModel);
                            handleDeleteClickOpen(selectedIDs);
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                );
            },
        });
    }

    return (
        <div className="UserTable-page">
            <Fragment>
                <Grid container className="container">
                    <Header />
                    <Grid item xs={12} className="form-container">
                        <TextField
                            label="Nom"
                            variant="outlined"
                            className="name-text-field"
                            size="small"
                            onChange={handleNameChange}
                            error={!isNameValid}
                        />
                        <TextField
                            label="Email"
                            variant="outlined"
                            className="email-text-field"
                            size="small"
                            onChange={handleEmailChange}
                            error={!isEmailValid}
                        />
                        <FormControl sx={{ width: "10%" }}>
                            <InputLabel id="demo-simple-select-label">
                                Rôle
                            </InputLabel>
                            <Select
                                value={selectedRole}
                                label="Role"
                                size="small"
                                onChange={handleChangeSelection}
                                error={!isRoleValid}
                            >
                                {roleList.map((role) => (
                                    <MenuItem
                                        key={role}
                                        value={role}
                                        disabled={role === "User"}
                                    >
                                        {role}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleAddClick}
                        >
                            Ajouter l'utilisateur
                        </Button>
                    </Grid>
                    <Grid item xs={12} className="table">
                        <DataGrid
                            key={users.length}
                            columns={columns}
                            rows={rows}
                            pageSize={5}
                            rowsPerPageOptions={[10, 25, 50, 100]}
                            checkboxSelection
                            disableSelectionOnClick
                            onRowSelectionModelChange={handleRowSelectionChange}
                            onColumnResize={handleColumnResize}
                            editMode="cell"
                            loading={loading}
                        />
                        {dialogOpen && selectedUserIDs.size > 0 ? (
                            <DeleteAlertDialog
                                isOpen={dialogOpen}
                                handleClose={handleDialogClose}
                                title="Confirmation de suppression"
                                description="Vous êtes sur le point de supprimer un/des utilisateur(s). Voulez-vous continuer ?"
                                onConfirm={handleDeleteConfirm}
                                selectedIds={selectedUserIDs}
                            />
                        ) : null}
                    </Grid>
                </Grid>
            </Fragment>
        </div>
    );
}

export default UserTable;
