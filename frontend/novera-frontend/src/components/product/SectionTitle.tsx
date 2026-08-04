interface SectionTitleProps {
    title: string;
    subtitle?: string;
}

const SectionTitle = ({
    title,
    subtitle
}: SectionTitleProps) => {

    return (

        <div className="text-center mb-12">

            <h2 className="text-4xl font-bold">

                {title}

            </h2>

            {subtitle && (

                <p className="text-gray-500 mt-3 text-lg">

                    {subtitle}

                </p>

            )}

        </div>

    );

};

export default SectionTitle;