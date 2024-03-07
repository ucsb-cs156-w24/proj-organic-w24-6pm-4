import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

function StaffForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    // Stryker disable all
    const {
        register,
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

                {/* <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="courseId">courseId</Form.Label>
                        <Form.Control
                            type="hidden"
                            {...register("courseId")}
                            value={courseId}
                        />
                    </Form.Group>
                </Col> */}

                <Col>
                <Form.Group className="mb-3" >
                        <Form.Label htmlFor="githubId">Github ID</Form.Label>
                        <Form.Control
                            data-testid="StaffForm-githubId "
                            id="githubId"
                            type="text"
                            isInvalid={Boolean(errors.githubId)}
                            {...register("githubId", { required: true })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.githubId && 'Github ID is required. '}
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