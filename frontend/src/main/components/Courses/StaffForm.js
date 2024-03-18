// import { useEffect } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

function StaffForm({ initialContents, submitAction, buttonLabel = "Add", courseId }) {

    // Stryker disable all
    const {
        register,
        // setValue,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    // Stryker restore all

    const navigate = useNavigate();

    return (

        <Form onSubmit={handleSubmit(submitAction)}>


            <Row>

                {initialContents && (
                    <Col>
                        <Form.Group className="mb-3" >
                            <Form.Label htmlFor="id">Id</Form.Label>
                            <Form.Control
                                data-testid="StaffForm-id"
                                id="id"
                                type="text"
                                {...register("id")}
                                value={initialContents.id}
                                disabled
                            />
                        </Form.Group>
                    </Col>
                )}

                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="courseId">Course ID</Form.Label>
                        <Form.Control
                            data-testid="StaffForm-courseId"
                            id="courseId"
                            type="text"
                            {...register("courseId")}
                            value={courseId}
                            readOnly
                        />
                    </Form.Group>
                </Col>

                <Col>
                <Form.Group className="mb-3" >
                        <Form.Label htmlFor="githubLogin">Github Login</Form.Label>
                        <Form.Control
                            data-testid="StaffForm-githubLogin "
                            id="githubLogin"
                            type="text"
                            isInvalid={Boolean(errors.githubLogin)}
                            {...register("githubLogin", { required: true })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.githubLogin && 'Github Login is required. '}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Button
                        type="submit"
                        data-testid="StaffForm-submit"
                    >
                        {buttonLabel}
                    </Button>
                    <Button
                        variant="Secondary"
                        onClick={() => navigate(-1)}
                        data-testid="StaffForm-cancel"
                    >
                        Cancel
                    </Button>
                </Col>
            </Row>
        </Form>

    )
}

export default StaffForm